"use client";

import { Check } from "lucide-react";
import { INTEGRATIONS, type IntegrationId } from "@/lib/integrations";

interface IntegrationSelectorProps {
  selected: IntegrationId[];
  onToggle: (id: IntegrationId) => void;
}

export default function IntegrationSelector({ selected, onToggle }: IntegrationSelectorProps) {
  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-ink">
        Select integrations <span className="font-normal text-subtle">(optional)</span>
      </span>
      <div className="grid grid-cols-2 gap-2.5">
        {INTEGRATIONS.map((integration) => {
          const isActive = selected.includes(integration.id);
          return (
            <button
              key={integration.id}
              type="button"
              onClick={() => onToggle(integration.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-all ${
                isActive
                  ? "border-violet/50 bg-violet/[0.04] shadow-glow"
                  : "border-line bg-white hover:border-violet/30"
              }`}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                style={{ backgroundColor: integration.tileBg, color: integration.tileColor }}
                aria-hidden
              >
                {integration.letter}
              </span>
              <span className="flex-1 text-sm font-medium text-ink">{integration.name}</span>
              <span
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                  isActive ? "border-violet bg-violet" : "border-line"
                }`}
                aria-hidden
              >
                {isActive && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
