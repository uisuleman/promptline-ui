import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Slider
 * Numeric value on a track — temperature, top-p, max tokens. Pass `[min,max]` value for a range.
 * Native range inputs underneath: arrow keys, Page Up/Down, Home/End all work.
 * Thumb styles live in tokens.css (.pl-range).
 */
export interface SliderProps {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onValueChange?: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  /** Show the value next to the label */
  showValue?: boolean;
  format?: (v: number) => string;
  /** Tick labels under the track, e.g. ["Precise", "Creative"] */
  marks?: string[];
  className?: string;
}

export function Slider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, label, showValue, format = String, marks, className }: SliderProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const range = Array.isArray(v);
  const vals = range ? (v as [number, number]) : [min, v as number];
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  const set = (nv: number | [number, number]) => { setInner(nv); onValueChange?.(nv); };
  const id = React.useId();

  const thumb = "pl-range absolute inset-0 h-5 w-full disabled:cursor-not-allowed";

  return (
    <div className={cn("w-full", disabled && "opacity-50", className)}>
      {(label || showValue) && (
        <div className="mb-3 flex items-baseline justify-between text-sm">
          {label && <label htmlFor={id} className="font-medium text-fg">{label}</label>}
          {showValue && <span className="tabular-nums text-fg-muted">{range ? `${format(vals[0])} – ${format(vals[1])}` : format(vals[1])}</span>}
        </div>
      )}
      <div className="relative h-5">
        <div className="absolute inset-x-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-2">
          <div className="absolute h-full rounded-full bg-accent" style={{ left: `${pct(vals[0])}%`, right: `${100 - pct(vals[1])}%` }} />
        </div>
        {range && (
          <input type="range" aria-label={`${label ?? "Value"} minimum`} min={min} max={max} step={step} disabled={disabled} value={vals[0]} onChange={(e) => set([Math.min(Number(e.target.value), vals[1]), vals[1]])} className={thumb} />
        )}
        <input
          id={id}
          type="range"
          aria-label={range ? `${label ?? "Value"} maximum` : label}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={vals[1]}
          onChange={(e) => { const n = Number(e.target.value); set(range ? [vals[0], Math.max(n, vals[0])] : n); }}
          className={thumb}
        />
      </div>
      {marks && (
        <div className="mt-2 flex justify-between text-xs text-fg-subtle">{marks.map((m) => <span key={m}>{m}</span>)}</div>
      )}
    </div>
  );
}
