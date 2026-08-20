"use client";

import { Sparkles } from "lucide-react";

const MAX_LENGTH = 1200;

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div>
      <label htmlFor="prompt" className="mb-2 block text-sm font-semibold text-ink">
        What do you want to build?
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="Build a subscription dashboard that shows analytics, manages customers, and sends email reports weekly."
        className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3.5 text-[15px] leading-relaxed text-ink placeholder:text-subtle outline-none transition-shadow focus:shadow-glow"
      />
      <p className="mt-2 flex items-center gap-1.5 text-xs text-subtle">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        Be specific about features, users, and goals for better results.
      </p>
    </div>
  );
}
