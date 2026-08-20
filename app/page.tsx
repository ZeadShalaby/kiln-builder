"use client";

import { useMemo, useState } from "react";
import PromptInput from "@/components/PromptInput";
import IntegrationSelector from "@/components/IntegrationSelector";
import AIResponse, { type PlanResponse } from "@/components/AIResponse";
import { INTEGRATIONS, integrationsById, type IntegrationId } from "@/lib/integrations";

function FlameMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2c1 3-2.5 4-2.5 7.5A2.5 2.5 0 0012 12a2.5 2.5 0 002.5-2.5c0-1-.5-1.5-.5-1.5 2 1 3 3.5 3 5.5a5 5 0 11-10 0c0-4 2-5 3-8 .3-.9 1-2.4 2-3.5z"
        fill="#FF5A2E"
      />
    </svg>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<IntegrationId[]>(["stripe", "gmail"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const selectedIntegrations = useMemo(() => integrationsById(selected), [selected]);

  const systemPromptPreview = useMemo(() => {
    const lines = [
      "You are Kiln, an assistant that turns a one-line product idea into a short, concrete build plan.",
      "...",
    ];
    if (selectedIntegrations.length > 0) {
      lines.push("", "Available integrations for this build:");
      selectedIntegrations.forEach((i) => lines.push(`- ${i.name}: ${i.context}`));
    } else {
      lines.push("", "No integrations selected — plan a self-contained build.");
    }
    return lines.join("\n");
  }, [selectedIntegrations]);

  function toggleIntegration(id: IntegrationId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setPlan(null);
    const started = performance.now();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, integrations: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong generating the plan.");
      }
      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setElapsedMs(performance.now() - started);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-char text-parch">
      <div className="pointer-events-none fixed inset-0 grain-overlay opacity-40" aria-hidden />

      {/* Nav */}
      <header className="relative border-b border-line/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <FlameMark />
            <span className="font-display text-lg tracking-tight">Kiln</span>
          </div>
          <a
            href="https://github.com"
            className="text-sm text-muted transition-colors hover:text-parch"
          >
            View source
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-ember animate-flicker" aria-hidden />
          Powered by Claude
        </span>
        <h1 className="mt-6 font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl">
          Describe it once.
          <br />
          <span className="text-ember">We&rsquo;ll forge the plan.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted sm:text-lg">
          Write what you want to build, pick the integrations it should assume exist, and Kiln
          drafts a concrete build plan around them.
        </p>
      </section>

      {/* Builder */}
      <section className="relative mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: inputs */}
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <div className="space-y-6">
              <PromptInput value={prompt} onChange={setPrompt} />
              <IntegrationSelector selected={selected} onToggle={toggleIntegration} />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ember px-4 py-3 text-sm font-medium text-char transition-all hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-char/30 border-t-char" />
                    Forging plan…
                  </>
                ) : (
                  <>
                    <FlameMark />
                    Forge the plan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: live system prompt preview — makes the mechanism visible */}
          <div className="flex flex-col rounded-xl border border-line bg-[#100D0B]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-line" aria-hidden />
              </div>
              <span className="text-xs font-mono text-muted">system_prompt.preview</span>
            </div>
            <pre className="scrollbar-thin flex-1 overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-[12.5px] leading-relaxed text-amber/90">
{systemPromptPreview}
            </pre>
            <div className="border-t border-line px-4 py-2.5 text-xs text-muted">
              This is what actually gets sent to the model — not just a UI list.
            </div>
          </div>
        </div>

        {/* Response */}
        <div className="mt-5">
          <AIResponse
            loading={loading}
            error={error}
            plan={plan}
            elapsedMs={elapsedMs}
            usedIntegrations={selectedIntegrations.map((i) => i.name)}
          />
        </div>
      </section>

      <footer className="relative mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="text-xs text-muted">
          Dummy integrations — {INTEGRATIONS.map((i) => i.name).join(", ")} — are used only as
          context for the model, not connected to live accounts.
        </p>
      </footer>
    </main>
  );
}
