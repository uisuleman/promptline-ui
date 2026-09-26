"use client";

import * as React from "react";
import { Check, Equal } from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/badge";

/**
 * ResponseCompare
 * Two answers side by side (stacked on small screens) and one question: which is better?
 * Used for A/B tests, model evaluation, and "we're testing a new version" moments.
 * Model names stay hidden until the user votes (`revealOnVote`) to avoid brand bias.
 */
export type Preference = "a" | "b" | "tie" | null;

export interface ResponseCompareProps {
  a: { content: React.ReactNode; model?: string };
  b: { content: React.ReactNode; model?: string };
  value?: Preference;
  onValueChange?: (v: Exclude<Preference, null>) => void;
  revealOnVote?: boolean;
  question?: string;
  className?: string;
}

export function ResponseCompare({ a, b, value = null, onValueChange, revealOnVote = true, question = "Which response is better?", className }: ResponseCompareProps) {
  const voted = value !== null;
  const panel = (key: "a" | "b", r: { content: React.ReactNode; model?: string }) => {
    const win = value === key, lose = voted && value !== key && value !== "tie";
    return (
      <div className={cn("flex min-w-0 flex-col rounded-lg border bg-bg transition-[border-color,opacity]", win ? "border-fg shadow-sm" : "border-border", lose && "opacity-60")}>
        <div className="flex h-10 items-center gap-2 border-b border-border px-4 text-xs font-medium text-fg-muted">
          Response {key.toUpperCase()}
          {voted && revealOnVote && r.model && <span className="text-fg">· {r.model}</span>}
          {win && <Badge tone="success" className="ml-auto"><Check />Preferred</Badge>}
        </div>
        <div className="flex-1 p-4 text-md text-fg">{r.content}</div>
        {!voted && (
          <button type="button" onClick={() => onValueChange?.(key)} className="m-3 mt-0 h-9 rounded-md border border-border text-sm font-medium text-fg transition-colors hover:border-fg hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20">
            {key.toUpperCase()} is better
          </button>
        )}
      </div>
    );
  };
  return (
    <div className={cn("space-y-3", className)} role="group" aria-label={question}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-fg">{voted ? "Thanks — your choice helps improve answers." : question}</p>
        {!voted && <button type="button" onClick={() => onValueChange?.("tie")} className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2 text-sm text-fg-muted hover:bg-surface-2 hover:text-fg"><Equal className="size-4" />About the same</button>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">{panel("a", a)}{panel("b", b)}</div>
    </div>
  );
}
