"use client";

import { INTEGRATIONS, type IntegrationId } from "@/lib/integrations";

interface IntegrationSelectorProps {
  selected: IntegrationId[];
  onToggle: (id: IntegrationId) => void;
}

export default function IntegrationSelector({ selected, onToggle }: IntegrationSelectorProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-parch">Integrations</span>
        <span className="text-xs text-muted">optional — used as context, not connected live</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {INTEGRATIONS.map((integration) => {
          const isActive = selected.includes(integration.id);
          return (
            <button
              key={integration.id}
              type="button"
              onClick={() => onToggle(integration.id)}
              aria-pressed={isActive}
              className={`group flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-all ${
                isActive
                  ? "border-ember/70 bg-ember/10 shadow-glow"
                  : "border-line bg-char/40 hover:border-line/80 hover:bg-surface2"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`text-sm font-medium ${isActive ? "text-parch" : "text-parch/85"}`}
                >
                  {integration.name}
                </span>
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded-sm border transition-colors ${
                    isActive ? "border-ember bg-ember" : "border-muted/50"
                  }`}
                  aria-hidden
                />
              </div>
              <span className="mt-0.5 text-xs text-muted">{integration.blurb}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
