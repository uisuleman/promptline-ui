"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Context
 * How full the model's context window is. A small ring in the prompt toolbar;
 * hover or focus shows the token breakdown and estimated cost.
 * Warn at 80% so users can start a new chat before quality drops.
 */
export interface ContextUsage { input: number; output: number; reasoning?: number; cached?: number }

export interface ContextProps {
  used: number;
  max: number;
  breakdown?: ContextUsage;
  /** Estimated cost in dollars */
  cost?: number;
  modelName?: string;
  className?: string;
}

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));

export function Context({ used, max, breakdown, cost, modelName, className }: ContextProps) {
  const [open, setOpen] = React.useState(false);
  const pct = Math.min(100, (used / max) * 100);
  const tone = pct >= 95 ? "text-danger" : pct >= 80 ? "text-warning" : "text-fg";
  const r = 7, c = 2 * Math.PI * r;

  return (
    <span className={cn("relative inline-flex", className)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={`Context ${Math.round(pct)}% used`}
        className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs font-medium tabular-nums text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <svg viewBox="0 0 18 18" className="size-4 -rotate-90" aria-hidden>
          <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2" className="stroke-border" />
          <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2" strokeLinecap="round" stroke="currentColor" className={cn("transition-[stroke-dashoffset] duration-500", tone)} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
        </svg>
        {Math.round(pct)}%
      </button>
      {open && (
        <span role="tooltip" className="absolute bottom-full left-0 z-50 mb-2 block w-64 rounded-lg border border-border bg-bg text-sm shadow-lg" style={{ animation: "pl-pop .15s var(--ease-out)" }}>
          <span className="block p-3">
            <span className="flex items-baseline justify-between">
              <span className="font-medium text-fg">Context window</span>
              <span className="text-xs tabular-nums text-fg-muted">{fmt(used)} / {fmt(max)}</span>
            </span>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-2">
              <span className={cn("block h-full rounded-full bg-current", tone)} style={{ width: `${pct}%` }} />
            </span>
            {pct >= 80 && <span className="mt-2 block text-xs text-fg-muted">Getting full. Start a new chat for best results.</span>}
          </span>
          {breakdown && (
            <span className="block space-y-1 border-t border-border p-3 text-xs">
              {([["Input", breakdown.input], ["Output", breakdown.output], ["Reasoning", breakdown.reasoning], ["Cached", breakdown.cached]] as const).map(([k, v]) =>
                v != null ? <span key={k} className="flex justify-between"><span className="text-fg-muted">{k}</span><span className="tabular-nums text-fg">{fmt(v)}</span></span> : null
              )}
            </span>
          )}
          {(cost != null || modelName) && (
            <span className="flex justify-between border-t border-border bg-surface px-3 py-2 text-xs">
              <span className="text-fg-muted">{modelName}</span>
              {cost != null && <span className="tabular-nums text-fg">${cost.toFixed(4)}</span>}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
