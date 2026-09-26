"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * RadioGroup
 * One choice from a short list. Native radios for free keyboard support (arrow keys move selection).
 * `variant="card"` renders bordered cards — good for plan or model pickers.
 */
export interface RadioOption { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean }

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  variant?: "default" | "card";
  orientation?: "vertical" | "horizontal";
  label?: string;
  className?: string;
}

export function RadioGroup({ options, value, defaultValue, onValueChange, name, variant = "default", orientation = "vertical", label, className }: RadioGroupProps) {
  const auto = React.useId();
  const [inner, setInner] = React.useState(defaultValue);
  const current = value ?? inner;
  const n = name ?? auto;
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-wrap", className)}>
      {options.map((o) => {
        const checked = current === o.value;
        return (
          <label
            key={o.value}
            className={cn(
              "group flex cursor-pointer items-start gap-3",
              variant === "card" && "rounded-lg border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fg/20",
              variant === "card" && (checked ? "border-fg bg-surface" : "border-border hover:border-border-strong"),
              o.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <input
              type="radio"
              name={n}
              value={o.value}
              checked={checked}
              disabled={o.disabled}
              onChange={() => { setInner(o.value); onValueChange?.(o.value); }}
              className="peer sr-only"
            />
            <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border shadow-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-fg/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg", checked ? "border-accent bg-accent" : "border-border-strong bg-bg")}>
              <span className={cn("size-1.5 rounded-full bg-accent-fg transition-transform", checked ? "scale-100" : "scale-0")} />
            </span>
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-fg">{o.label}</span>
              {o.description && <span className="block text-xs text-fg-muted">{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}
