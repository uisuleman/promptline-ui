"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Branch
 * Navigate between alternative responses (after regenerate) or edited prompts.
 * Renders only the active branch; the pager shows "2 / 3".
 */
export interface BranchProps {
  branches: React.ReactNode[];
  /** Controlled index */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (i: number) => void;
  /** Where to put the pager relative to content */
  pager?: "top" | "bottom";
  className?: string;
}

export function Branch({ branches, index, defaultIndex, onIndexChange, pager = "bottom", className }: BranchProps) {
  const [inner, setInner] = React.useState(defaultIndex ?? branches.length - 1);
  const i = Math.min(index ?? inner, branches.length - 1);
  const go = (n: number) => { const v = (n + branches.length) % branches.length; setInner(v); onIndexChange?.(v); };
  const nav = branches.length > 1 && <BranchPager index={i} total={branches.length} onPrev={() => go(i - 1)} onNext={() => go(i + 1)} />;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {pager === "top" && nav}
      <div key={i} style={{ animation: "pl-in .2s ease-out" }}>{branches[i]}</div>
      {pager === "bottom" && nav}
    </div>
  );
}

export function BranchPager({ index, total, onPrev, onNext, className }: { index: number; total: number; onPrev: () => void; onNext: () => void; className?: string }) {
  const btn = "grid size-6 place-items-center rounded-xs text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-40";
  return (
    <div className={cn("inline-flex items-center gap-1 text-xs text-fg-muted", className)} role="group" aria-label="Response versions">
      <button type="button" className={btn} onClick={onPrev} aria-label="Previous version"><ChevronLeft className="size-3.5" /></button>
      <span className="min-w-8 text-center tabular-nums" aria-live="polite">{index + 1} / {total}</span>
      <button type="button" className={btn} onClick={onNext} aria-label="Next version"><ChevronRight className="size-3.5" /></button>
    </div>
  );
}
