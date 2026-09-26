"use client";

import * as React from "react";
import { Check, HelpCircle, CornerDownLeft } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * ClarifyingQuestion
 * The agent asks before it acts: a short question with 2–4 answers, an optional "Other" answer,
 * and Skip. One click answers; the card then collapses to a record of the choice.
 * Number keys 1–9 pick an option.
 */
export interface QuestionOption { value: string; label: string; description?: string; recommended?: boolean }

export interface ClarifyingQuestionProps {
  question: string;
  options: QuestionOption[];
  multiple?: boolean;
  allowOther?: boolean;
  onAnswer: (answer: { values: string[]; other?: string }) => void;
  onSkip?: () => void;
  /** Answered state — shows the chosen labels */
  answered?: string[];
  className?: string;
}

export function ClarifyingQuestion({ question, options, multiple, allowOther = true, onAnswer, onSkip, answered, className }: ClarifyingQuestionProps) {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [other, setOther] = React.useState("");
  const [otherOn, setOtherOn] = React.useState(false);
  const submit = (vals = picked) => onAnswer({ values: vals, other: otherOn && other.trim() ? other.trim() : undefined });
  const choose = (v: string) => {
    if (!multiple) { setPicked([v]); submit([v]); return; }
    setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  };

  if (answered)
    return (
      <div className={cn("inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm", className)}>
        <Check className="size-4 shrink-0 text-success" />
        <span className="truncate text-fg-muted">{question}</span>
        <span className="shrink-0 font-medium text-fg">{answered.join(", ")}</span>
      </div>
    );

  return (
    <div
      role="group"
      aria-label={question}
      className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm shadow-xs", className)}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        const n = Number(e.key);
        if (n >= 1 && n <= options.length) { e.preventDefault(); choose(options[n - 1].value); }
      }}
    >
      <div className="flex items-start gap-3 p-4 pb-3">
        <HelpCircle className="mt-0.5 size-4 shrink-0 text-fg-muted" />
        <p className="text-base font-medium text-fg">{question}</p>
      </div>
      <div className="space-y-1.5 px-3 pb-3" role={multiple ? "group" : "radiogroup"}>
        {options.map((o, i) => {
          const on = picked.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => choose(o.value)}
              className={cn("flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20", on ? "border-fg bg-surface" : "border-border hover:border-border-strong hover:bg-surface")}
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-xs border border-border bg-surface text-2xs font-medium tabular-nums text-fg-muted">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-medium text-fg">{o.label}{o.recommended && <span className="text-2xs font-medium text-info">Recommended</span>}</span>
                {o.description && <span className="mt-0.5 block text-xs text-fg-muted">{o.description}</span>}
              </span>
              {multiple && <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-xs border", on ? "border-accent bg-accent text-accent-fg" : "border-border-strong")}>{on && <Check className="size-3" strokeWidth={3} />}</span>}
            </button>
          );
        })}
        {allowOther && (
          otherOn ? (
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (other.trim()) submit(multiple ? picked : []); }}>
              <input autoFocus value={other} onChange={(e) => setOther(e.target.value)} placeholder="Type your answer…" aria-label="Other answer" className="h-9 flex-1 rounded-md border border-border-strong bg-bg px-3 text-base text-fg focus:outline-none focus:ring-4 focus:ring-fg/5" />
              {!multiple && <Button type="submit" size="icon" disabled={!other.trim()} aria-label="Send answer"><CornerDownLeft /></Button>}
            </form>
          ) : (
            <button type="button" onClick={() => setOtherOn(true)} className="flex h-9 w-full items-center rounded-md px-3 text-left text-fg-muted hover:bg-surface hover:text-fg">Something else…</button>
          )
        )}
      </div>
      {(multiple || onSkip) && (
        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2">
          {onSkip ? <button type="button" onClick={onSkip} className="text-sm text-fg-muted hover:text-fg">Skip, you decide</button> : <span />}
          {multiple && <Button size="sm" onClick={() => submit()} disabled={!picked.length && !other.trim()}>Continue</Button>}
        </div>
      )}
    </div>
  );
}
