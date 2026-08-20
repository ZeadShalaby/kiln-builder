import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { integrationsById, type IntegrationId } from "@/lib/integrations";

export const runtime = "nodejs";

const MAX_PROMPT_LENGTH = 1200;
const VALID_IDS: IntegrationId[] = ["stripe", "shopify", "gmail", "slack", "sheets"];
const CREATIVITY_TEMPERATURES = { focused: 0.25, balanced: 0.7, creative: 1.0 } as const;
type Creativity = keyof typeof CREATIVITY_TEMPERATURES;

interface GenerateRequestBody {
  prompt?: unknown;
  integrations?: unknown;
  creativity?: unknown;
}

interface PlanResponse {
  overview: string;
  features: string[];
  techStack: string[];
  plan: string[];
}

// Static demo plan used when the Anthropic account has no credit left.
// Lets the rest of the app (UI, integrations picker, etc.) keep working
// end-to-end without a live model call.
const FALLBACK_PLAN: PlanResponse = {
  overview:
    "This is a sample build plan shown because the connected Anthropic account is out of credit. It illustrates the shape of a real response — once credits are added, this screen will show a plan generated specifically from your prompt.",
  features: [
    "Example feature one (placeholder)",
    "Example feature two (placeholder)",
    "Example feature three (placeholder)",
    "Example feature four (placeholder)",
  ],
  techStack: ["Next.js", "TypeScript", "Anthropic API", "Tailwind CSS"],
  plan: [
    "Add credit to the Anthropic account (Console → Plans & Billing)",
    "Re-run this prompt to get a real, tailored plan",
    "Wire up the selected integrations",
    "Ship an MVP based on the generated plan",
  ],
};

function buildSystemPrompt(selected: ReturnType<typeof integrationsById>): string {
  const base = [
    "You are Kiln, an assistant that turns a one-line product idea into a short, concrete build plan.",
    "You do not write full source code here — you produce a plan a developer could start executing immediately.",
    "Be specific to what the user actually described. Do not pad with generic boilerplate features unrelated to their idea.",
  ];

  if (selected.length > 0) {
    base.push(
      "",
      "The user has selected the following integrations for this build. Treat them as already available — design the plan assuming they exist, and reference them by name in relevant features or steps. Do not invent integrations the user did not select, and do not skip the ones they did.",
      "",
      ...selected.map((i) => `- ${i.name}: ${i.context}`)
    );
  } else {
    base.push(
      "",
      "No integrations were selected. Design a self-contained plan that does not depend on any third-party service."
    );
  }

  base.push(
    "",
    "Respond with ONLY a single JSON object, no prose before or after, no markdown code fences, matching exactly this shape:",
    `{"overview": string, "features": string[], "techStack": string[], "plan": string[]}`,
    "- overview: 2-4 sentences describing the build.",
    "- features: 4-6 short bullet phrases, specific to the idea and selected integrations.",
    "- techStack: 4-8 short items (languages, frameworks, services).",
    "- plan: 4-6 short ordered implementation steps."
  );

  return base.join("\n");
}

function isValidIntegrationId(value: unknown): value is IntegrationId {
  return typeof value === "string" && (VALID_IDS as string[]).includes(value);
}

function resolveCreativity(value: unknown): Creativity {
  if (value === "focused" || value === "balanced" || value === "creative") return value;
  return "balanced";
}

function extractJson(text: string): PlanResponse | null {
  const trimmed = text.trim();
  const withoutFences = trimmed.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const parsed = JSON.parse(withoutFences.slice(start, end + 1));
    if (
      typeof parsed.overview === "string" &&
      Array.isArray(parsed.features) &&
      Array.isArray(parsed.techStack) &&
      Array.isArray(parsed.plan)
    ) {
      return parsed as PlanResponse;
    }
    return null;
  } catch {
    return null;
  }
}

// Detects the specific "credit balance too low" error the Anthropic API
// returns (400 invalid_request_error) so we can treat it differently from
// other failures (bad key, network issue, rate limit, etc).
function isLowBalanceError(err: unknown): boolean {
  if (!(err instanceof Anthropic.APIError)) return false;
  if (err.status !== 400) return false;
  const message = err.message || "";
  return /credit balance is too low/i.test(message);
}

export async function POST(req: NextRequest) {
  let body: GenerateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json({ error: "Describe what you want to build first." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Keep the description under ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const rawIds = Array.isArray(body.integrations) ? body.integrations : [];
  const integrationIds = rawIds.filter(isValidIntegrationId);
  const selected = integrationsById(integrationIds);
  const creativity = resolveCreativity(body.creativity);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it to .env.local and restart the server." },
      { status: 500 }
    );
  }

  const systemPrompt = buildSystemPrompt(selected);
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      temperature: CREATIVITY_TEMPERATURES[creativity],
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const rawText = textBlock && "text" in textBlock ? textBlock.text : "";

    const plan = extractJson(rawText);
    if (!plan) {
      return NextResponse.json(
        { error: "The model returned a response that couldn't be parsed. Try again.", raw: rawText },
        { status: 502 }
      );
    }

    return NextResponse.json({
      plan,
      meta: {
        model,
        creativity,
        integrations: selected.map((i) => i.name),
        systemPrompt,
      },
    });
  } catch (err) {
    if (isLowBalanceError(err)) {
      // Don't fail the request — return a static demo plan plus a clear
      // notice so the UI can show "sample data, add credit to go live"
      // instead of an error screen.
      return NextResponse.json({
        plan: FALLBACK_PLAN,
        fallback: true,
        notice:
          "Your Anthropic account has run out of credit, so this is a static sample plan, not a real model response. Add credit in Console → Plans & Billing, then try again.",
        meta: {
          model,
          creativity,
          integrations: selected.map((i) => i.name),
          systemPrompt,
        },
      });
    }

    const message = err instanceof Error ? err.message : "Unknown error calling the model.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}