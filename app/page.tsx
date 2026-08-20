"use client";

import { useMemo, useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import PromptInput from "@/components/PromptInput";
import IntegrationSelector from "@/components/IntegrationSelector";
import AIResponse, { type PlanResponse } from "@/components/AIResponse";
import { integrationsById, type IntegrationId } from "@/lib/integrations";

type Creativity = "focused" | "balanced" | "creative";

const CREATIVITY_LABELS: Record<Creativity, string> = {
  focused: "Focused",
  balanced: "Balanced",
  creative: "Creative",
};

const TRUSTED_BY = ["Acme Labs", "Boltshift", "Novus", "Catalyst", "Sigma"];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<IntegrationId[]>(["stripe", "shopify", "gmail", "slack", "sheets"]);
  const [creativity, setCreativity] = useState<Creativity>("balanced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const selectedIntegrations = useMemo(() => integrationsById(selected), [selected]);

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
        body: JSON.stringify({ prompt, integrations: selected, creativity }),
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
    <main className="min-h-screen bg-hero">
      {/* Nav */}
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet animate-sparkle" strokeWidth={2.25} />
            <span className="text-lg font-bold tracking-tight text-ink">Kiln</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-ink">How it works</a>
            <a href="#integrations" className="transition-colors hover:text-ink">Integrations</a>
            <a href="#" className="transition-colors hover:text-ink">Examples</a>
            <a href="#" className="transition-colors hover:text-ink">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              className="hidden rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white sm:block"
            >
              Source
            </a>
            <button className="rounded-lg bg-violet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-dark">
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/20 bg-violet/[0.06] px-3.5 py-1.5 text-xs font-medium text-violet-dark">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          AI-Powered <span className="text-violet/40">•</span> Build anything
        </span>
        <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
          Describe it. Integrate it.
          <br />
          <span className="text-violet">We&rsquo;ll build it.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted sm:text-lg">
          Tell us what you want to build and select the integrations you need.{" "}
          <br className="hidden sm:block" />
          Our AI will generate a plan based on the selected integrations.
        </p>
      </section>

      {/* Builder card */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 pb-6">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-6">
              <PromptInput value={prompt} onChange={setPrompt} />

              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="mb-1.5 block text-xs font-medium text-subtle">AI Model</label>
                  <div className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink/60">
                    Claude Sonnet 5
                    <ChevronDown className="h-4 w-4 text-subtle" />
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label htmlFor="creativity" className="mb-1.5 block text-xs font-medium text-subtle">
                    Creativity
                  </label>
                  <div className="relative">
                    <select
                      id="creativity"
                      value={creativity}
                      onChange={(e) => setCreativity(e.target.value as Creativity)}
                      className="w-full appearance-none rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition-shadow focus:shadow-glow"
                    >
                      {(Object.keys(CREATIVITY_LABELS) as Creativity[]).map((c) => (
                        <option key={c} value={c}>
                          {CREATIVITY_LABELS[c]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  </div>
                </div>
              </div>
            </div>

            <div id="integrations" className="flex flex-col gap-6">
              <IntegrationSelector selected={selected} onToggle={toggleIntegration} />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-violet px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-violet-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" strokeWidth={2.25} />
                    Generate Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Response */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <AIResponse
          loading={loading}
          error={error}
          plan={plan}
          elapsedMs={elapsedMs}
          usedIntegrations={selectedIntegrations.map((i) => i.name)}
        />
      </section>

      {/* Trusted by */}
      <section className="border-t border-line/70 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-6 text-sm font-medium text-subtle">Trusted by builders</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED_BY.map((name) => (
              <span key={name} className="text-sm font-semibold text-ink/30">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
