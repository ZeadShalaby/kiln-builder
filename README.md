# Kiln

Describe what you want to build, pick the integrations it should assume exist, and Kiln drafts a
concrete build plan — powered by Claude.

Built for the Stunning "Full-Stack Vibe Coder" task: a landing page with a prompt input, a dummy
integration selector, and an end-to-end flow where the selected integrations are injected into the
system prompt before the request reaches the model.

## How it works

1. You type a one-line product idea into the prompt box.
2. You toggle any of five dummy integrations (Stripe, Shopify, Gmail, Slack, Google Sheets). These
   don't connect to anything real — they exist only as context for the model.
3. On submit, the frontend sends `{ prompt, integrations }` to `POST /api/generate`.
4. The API route (`app/api/generate/route.ts`) builds a system prompt that lists exactly the
   integrations you selected, with a one-line description of what each one means for the build,
   and sends it to Claude alongside your prompt.
5. The model responds with a structured plan (overview, features, tech stack, build steps), which
   is parsed and rendered as a tabbed panel.
6. The right-hand panel on the page mirrors the actual system prompt live, so the effect of
   toggling integrations is visible before you even submit — it's the real string, not a mockup.

## Stack

- **Next.js 14** (App Router) + **TypeScript** — single project, frontend and backend together
- **Tailwind CSS** — styling
- **@anthropic-ai/sdk** — model calls from the API route (server-side only, key never touches the client)

## Run it

Requires Node 18.17+.

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your key from https://console.anthropic.com/settings/keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Server-side key used by the API route. Never exposed to the browser. |
| `ANTHROPIC_MODEL` | No | Overrides the model id. Defaults to `claude-sonnet-5`. |

If `ANTHROPIC_API_KEY` is missing, `/api/generate` returns a clear `500` error instead of crashing
or hanging — try it, the app itself works fine without a key up until you hit "Forge the plan."

## Project structure

```
app/
  page.tsx              # Landing page (client component, holds all UI state)
  layout.tsx            # Root layout, metadata
  globals.css           # Tokens, base styles, reduced-motion + focus handling
  api/generate/route.ts # POST endpoint: builds the system prompt, calls Claude, parses the reply
components/
  PromptInput.tsx        # Prompt textarea
  IntegrationSelector.tsx# Toggleable integration chips
  AIResponse.tsx          # Tabbed plan output (loading / error / result states)
lib/
  integrations.ts        # Single source of truth for the 5 dummy integrations and their
                          # "what this means for the model" context strings
DECISIONS.md
TECH.md
```

## Notes on the implementation

- **Integrations genuinely affect the output**, not just the UI. `lib/integrations.ts` pairs each
  integration with a context sentence; the API route only includes the ones you actually selected,
  by name, in the system prompt — nothing is hardcoded into a single static prompt string.
- **Validation happens server-side too**: empty prompts, prompts over 1200 characters, and unknown
  integration ids are all rejected or filtered in the API route, not just the UI.
- **The model's raw text is parsed defensively** (`extractJson` in `route.ts` strips stray code
  fences and pulls out the first JSON object) since models occasionally wrap JSON in prose despite
  instructions — if parsing fails, the route returns a `502` with the raw text rather than a blank
  screen.
