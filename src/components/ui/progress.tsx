import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Progress
 * Determinate bar or ring for known progress (uploads, indexing, onboarding steps).
 * Omit `value` for an indeterminate bar. Label + value are announced to screen readers.
 */
export interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const toneCls = { default: "bg-accent", success: "bg-success", warning: "bg-warning", danger: "bg-danger" };

export function Progress({ value, max = 100, label, showValue, size = "md", tone = "default", className }: ProgressProps) {
  const pct = value == null ? null : Math.min(100, (value / max) * 100);
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex justify-between text-sm">
          {label && <span className="font-medium text-fg">{label}</span>}
          {showValue && pct != null && <span className="tabular-nums text-fg-muted">{Math.round(pct)}%</span>}
        </div>
      )}
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className={cn("relative overflow-hidden rounded-full bg-surface-2", size === "sm" ? "h-1" : "h-2")}>
        {pct == null ? (
          <div className={cn("absolute inset-y-0 w-1/3 rounded-full", toneCls[tone])} style={{ animation: "pl-indeterminate 1.4s ease-in-out infinite" }} />
        ) : (
          <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", toneCls[tone])} style={{ width: `${pct}%` }} />
        )}
      </div>
    </div>
  );
}

export function ProgressRing({ value, max = 100, size = 40, stroke = 4, label, showValue = true, className }: { value: number; max?: number; size?: number; stroke?: number; label?: string; showValue?: boolean; className?: string }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, pct = Math.min(100, (value / max) * 100);
  return (
    <span role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-2" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" className="stroke-accent transition-[stroke-dashoffset] duration-500" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      {showValue && <span className="absolute text-2xs font-medium tabular-nums text-fg">{Math.round(pct)}%</span>}
    </span>
  );
}
