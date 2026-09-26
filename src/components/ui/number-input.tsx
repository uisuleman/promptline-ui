import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * NumberInput
 * A numeric field with steppers. Typing is free; the value is parsed, clamped and rounded
 * on blur or Enter, so half-typed numbers never fight the user.
 * ↑ ↓ step · Shift = ×10 · PageUp/PageDown ×10 · Home/End jump to min/max · hold a stepper to repeat.
 */
export interface NumberInputProps {
  value: number;
  onValueChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places (defaults to the step's precision) */
  precision?: number;
  /** Unit shown after the number, e.g. "tokens" or "%" */
  suffix?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

const sizes = { sm: "h-8", md: "h-9", lg: "h-10" };

export function NumberInput({ value, onValueChange, min = -Infinity, max = Infinity, step = 1, precision, suffix, size = "md", disabled, id, className, ...aria }: NumberInputProps) {
  const places = precision ?? (String(step).split(".")[1]?.length ?? 0);
  const fmt = (v: number) => v.toFixed(places);
  const [draft, setDraft] = React.useState(fmt(value));
  const [editing, setEditing] = React.useState(false);
  const clamp = (v: number) => Math.min(max, Math.max(min, Number(v.toFixed(places))));
  const set = (v: number) => { const c = clamp(v); onValueChange(c); setDraft(fmt(c)); };
  const latest = React.useRef(value);
  latest.current = value;

  React.useEffect(() => { if (!editing) setDraft(fmt(value)); }, [value, editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = () => {
    setEditing(false);
    const n = parseFloat(draft.replace(/[^\d.\-]/g, ""));
    if (isNaN(n)) setDraft(fmt(value)); else set(n);
  };

  // Press-and-hold repeat
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hold = (dir: 1 | -1) => {
    set(latest.current + dir * step);
    const rep = (delay: number) => { timer.current = setTimeout(() => { set(latest.current + dir * step); rep(Math.max(40, delay * 0.8)); }, delay); };
    rep(400);
  };
  const release = () => clearTimeout(timer.current);
  React.useEffect(() => release, []);

  const parsed = parseFloat(draft);
  const outOfRange = editing && !isNaN(parsed) && (parsed < min || parsed > max);
  const btn = "grid aspect-square h-full shrink-0 place-items-center text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5";

  return (
    <div className={cn("inline-flex w-full max-w-[11rem] items-stretch overflow-hidden rounded-md border bg-bg shadow-xs transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:ring-4 focus-within:ring-fg/5",
      outOfRange ? "border-danger/50" : "border-border", sizes[size], disabled && "opacity-50", className)}>
      <button type="button" tabIndex={-1} aria-label="Decrease" disabled={disabled || value <= min} onPointerDown={() => hold(-1)} onPointerUp={release} onPointerLeave={release} className={cn(btn, "border-r border-border")}><Minus /></button>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1 px-2">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={isFinite(min) ? min : undefined}
          aria-valuemax={isFinite(max) ? max : undefined}
          {...aria}
          aria-invalid={outOfRange || aria["aria-invalid"] || undefined}
          disabled={disabled}
          value={draft}
          onFocus={(e) => { setEditing(true); e.currentTarget.select(); }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            const big = step * 10;
            const k: Record<string, () => void> = {
              ArrowUp: () => set(value + (e.shiftKey ? big : step)), ArrowDown: () => set(value - (e.shiftKey ? big : step)),
              PageUp: () => set(value + big), PageDown: () => set(value - big),
              Home: () => isFinite(min) && set(min), End: () => isFinite(max) && set(max),
              Enter: () => commit(),
            };
            if (k[e.key]) { e.preventDefault(); k[e.key](); if (e.key !== "Enter") setEditing(false); }
          }}
          style={{ width: `${Math.max(2, draft.length + 0.5)}ch` }}
          className="min-w-0 bg-transparent text-center text-sm tabular-nums text-fg focus:outline-none"
        />
        {suffix && <span className="shrink-0 text-sm text-fg-subtle">{suffix}</span>}
      </div>
      <button type="button" tabIndex={-1} aria-label="Increase" disabled={disabled || value >= max} onPointerDown={() => hold(1)} onPointerUp={release} onPointerLeave={release} className={cn(btn, "border-l border-border")}><Plus /></button>
    </div>
  );
}
