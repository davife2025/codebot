"use client";

import type { ModelOption } from "@/lib/types";

interface ModelSelectorProps {
  models: ModelOption[];
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-auto rounded-lg border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm font-medium"
    >
      {!models.some((m) => m.id === value) && value && (
        <option value={value}>{value}</option>
      )}
      {models.map((m) => (
        <option key={m.id} value={m.id}>
          {m.label}
        </option>
      ))}
    </select>
  );
}
