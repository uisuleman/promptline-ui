"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * UsageMeter
 * Credits, messages or tokens remaining. Neutral until 80%, amber at 80%, red at 95%.
 * Always say when it resets — a limit without a reset time feels like a wall.
 */
export interface UsageMeterProps {
  used: number;
  limit: number;
  label?: string;
  unit?: string;
  resetText?: string;
  onUpgrade?: () => void;
  variant?: "card" | "inline";
  className?: string;
}

export function UsageMeter({ used, limit, label = "Credits", unit, resetText, onUpgrade, variant = "card", className }: UsageMeterProps) {
  const pct = Math.min(100, (used / limit) * 100);
  const bar = pct >= 95 ? "bg-danger" : pct >= 80 ? "bg-warning" : "bg-fg";
  const n = (x: number) => x.toLocaleString();
  return (
    <div className={cn("space-y-2", variant === "card" && "rounded-lg border border-border bg-bg p-4", className)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-fg">{label}</span>
        <span className="text-xs tabular-nums text-fg-muted">{n(used)} / {n(limit)}{unit && ` ${unit}`}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label={label} aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit}>
        <div className={cn("h-full rounded-full transition-[width] duration-500 ease-out", bar)} style={{ width: `${pct}%` }} />
      </div>
      {(resetText || onUpgrade) && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-fg-subtle">{resetText}</span>
          {onUpgrade && <button type="button" onClick={onUpgrade} className="font-medium text-fg underline-offset-4 hover:underline">Upgrade</button>}
        </div>
      )}
    </div>
  );
}
