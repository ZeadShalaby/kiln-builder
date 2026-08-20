"use client";

import { useState } from "react";

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
  { id: "stack", label: "Tech stack" },
  { id: "plan", label: "Build plan" },
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
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-line/70 px-6 py-16 text-center">
        <div className="mb-3 h-9 w-9 rounded-full border border-line/70" aria-hidden />
        <p className="text-sm text-muted">
          Your build plan will show up here once you describe something and hit forge.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface animate-rise">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ember animate-flicker" aria-hidden />
          <h3 className="text-sm font-medium text-parch">Build plan</h3>
        </div>
        {elapsedMs !== null && !loading && (
          <span className="text-xs font-mono text-muted">forged in {(elapsedMs / 1000).toFixed(1)}s</span>
        )}
      </div>

      {error && (
        <div className="px-5 py-6">
          <p className="text-sm text-ember">{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-3 px-5 py-6">
          <div className="h-3 w-3/4 animate-pulse rounded bg-surface2" />
          <div className="h-3 w-full animate-pulse rounded bg-surface2" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-surface2" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-surface2" />
        </div>
      )}

      {plan && !loading && !error && (
        <div>
          <div className="flex gap-1 overflow-x-auto border-b border-line px-3 pt-2 scrollbar-thin">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-t-md px-3 py-2 text-sm transition-colors ${
                  tab === t.id
                    ? "border-b-2 border-ember text-parch"
                    : "text-muted hover:text-parch/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="px-5 py-5">
            {tab === "overview" && (
              <div className="space-y-4">
                <p className="text-[15px] leading-relaxed text-parch/90">{plan.overview}</p>
                {usedIntegrations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {usedIntegrations.map((name) => (
                      <span
                        key={name}
                        className="rounded-full border border-line bg-char/50 px-2.5 py-1 text-xs text-muted"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "features" && (
              <ul className="space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] text-parch/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
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
                    className="rounded-md border border-line bg-char/50 px-2.5 py-1.5 font-mono text-xs text-amber"
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
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/15 font-mono text-[11px] text-ember">
                      {i + 1}
                    </span>
                    <span className="text-[15px] text-parch/90">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
