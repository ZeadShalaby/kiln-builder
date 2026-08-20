"use client";

const MAX_LENGTH = 1200;

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptInput({ value, onChange }: PromptInputProps) {
  const remaining = MAX_LENGTH - value.length;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor="prompt" className="text-sm font-medium text-parch">
          What do you want to build?
        </label>
        <span
          className={`text-xs font-mono ${remaining < 0 ? "text-ember" : "text-muted"}`}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={5}
        placeholder="Build a subscription dashboard that shows analytics, manages customers, and sends weekly email reports."
        className="w-full resize-none rounded-lg border border-line bg-char/60 px-4 py-3 text-[15px] leading-relaxed text-parch placeholder:text-muted/70 outline-none transition-colors focus:border-ember/60"
      />
      <p className="mt-2 text-xs text-muted">
        Be specific about features, users, and goals — it changes the plan you get back.
      </p>
    </div>
  );
}
