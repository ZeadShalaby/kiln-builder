"use client";

import { useState } from "react";
import { Sparkles, Circle } from "lucide-react";

export interface PlanResponse {
  overview: string;
  features: string[];
  techStack: string[];
  plan: string[];
}

type Tab = "overview" | "features" | "stack" | "plan";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "stack", label: "Tech Stack" },
  { id: "plan", label: "Implementation Plan" },
];

interface AIResponseProps {
  loading: boolean;
  error: string | null;
  plan: PlanResponse | null;
  elapsedMs: number | null;
  usedIntegrations: string[];
}

export default function AIResponse({ loading, error, plan, elapsedMs, usedIntegrations }: AIResponseProps) {
  const [tab, setTab] = useState<Tab>("overview");

  if (!loading && !error && !plan) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/50 px-6 py-16 text-center">
        <Sparkles className="mb-3 h-7 w-7 text-violet/40" strokeWidth={1.5} />
        <p className="text-sm text-subtle">
          Your build plan will show up here once you describe something and hit generate.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-panelLine bg-panel shadow-card animate-rise">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-panelLine px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-light" strokeWidth={2} />
            <h3 className="text-[15px] font-semibold text-white">AI Response</h3>
          </div>
          {!loading && !error && plan && (
            <p className="mt-1 text-sm text-white/50">
              Here&rsquo;s a plan for your build with the selected integrations.
            </p>
          )}
        </div>
        {elapsedMs !== null && !loading && (
          <span className="whitespace-nowrap text-xs text-white/40">
            Generated in {(elapsedMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>

      {error && (
        <div className="px-6 py-8">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      )}

      {loading && (
        <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-panel2" />
            <div className="h-3 w-full animate-pulse rounded bg-panel2" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-panel2" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-panel2" />
          </div>
          <div className="h-48 animate-pulse rounded-xl bg-panel2" />
        </div>
      )}

      {plan && !loading && !error && (
        <div>
          <div className="flex gap-1 overflow-x-auto border-b border-panelLine px-4 pt-2 scrollbar-thin">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-t-md px-3.5 py-2.5 text-sm transition-colors ${
                  tab === t.id
                    ? "border-b-2 border-violet-light text-white"
                    : "text-white/45 hover:text-white/75"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* Left: tab content */}
            <div className="min-h-[220px]">
              {tab === "overview" && (
                <div className="space-y-4">
                  <p className="text-[15px] leading-relaxed text-white/80">{plan.overview}</p>
                  {plan.features.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-light">
                        Key Features
                      </p>
                      <ul className="space-y-1.5">
                        {plan.features.slice(0, 5).map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <Circle className="mt-1 h-1.5 w-1.5 shrink-0 fill-violet-light text-violet-light" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {usedIntegrations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {usedIntegrations.map((name) => (
                        <span
                          key={name}
                          className="rounded-full border border-panelLine bg-panel2 px-2.5 py-1 text-xs text-white/60"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "features" && (
                <ul className="space-y-2.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2.5 text-[15px] text-white/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-light" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {tab === "stack" && (
                <div className="flex flex-wrap gap-2">
                  {plan.techStack.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-panelLine bg-panel2 px-2.5 py-1.5 font-mono text-xs text-violet-light"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {tab === "plan" && (
                <ol className="space-y-3">
                  {plan.plan.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/20 font-mono text-[11px] text-violet-light">
                        {i + 1}
                      </span>
                      <span className="text-[15px] text-white/80">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Right: mock dashboard preview — illustrative browser chrome */}
            <div className="overflow-hidden rounded-xl border border-panelLine bg-[#0A0812]">
              <div className="flex items-center gap-1.5 border-b border-panelLine px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-[11px] text-white/30">preview.app</span>
              </div>
              <div className="p-3.5">
                <p className="mb-2.5 text-xs font-semibold text-white/70">Overview</p>
                <div className="grid grid-cols-2 gap-2">
                  {plan.techStack.slice(0, 4).map((s, i) => (
                    <div key={i} className="rounded-lg border border-panelLine bg-panel2 px-2.5 py-2">
                      <p className="truncate text-[11px] text-white/40">{s}</p>
                      <p className="mt-1 text-[13px] font-semibold text-white">Ready</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 rounded-lg border border-panelLine bg-panel2 px-2.5 py-3">
                  <p className="mb-2 text-[11px] text-white/40">Build steps</p>
                  <div className="flex items-end gap-1">
                    {plan.plan.map((_, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-violet/20 to-violet-light"
                        style={{ height: `${18 + ((i * 13) % 34)}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
