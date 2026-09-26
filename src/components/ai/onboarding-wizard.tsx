"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * OnboardingWizard
 * A short multi-step setup (3–5 steps): use case → connect data → first prompt.
 * Stepper on top, one decision per step, Back always available, optional steps can be skipped.
 * `canContinue` per step gates the Next button until the step is valid.
 */
export interface WizardStep { id: string; title: string; description?: string; content: React.ReactNode; optional?: boolean; canContinue?: boolean }

export interface OnboardingWizardProps {
  steps: WizardStep[];
  step?: number;
  onStepChange?: (i: number) => void;
  onFinish: () => void;
  finishLabel?: string;
  className?: string;
}

export function OnboardingWizard({ steps, step, onStepChange, onFinish, finishLabel = "Get started", className }: OnboardingWizardProps) {
  const [inner, setInner] = React.useState(0);
  const i = step ?? inner;
  const go = (n: number) => { setInner(n); onStepChange?.(n); };
  const s = steps[i];
  const last = i === steps.length - 1;
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const first = React.useRef(true);
  React.useEffect(() => { if (first.current) { first.current = false; return; } headingRef.current?.focus(); }, [i]);

  return (
    <div className={cn("w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg shadow-sm", className)}>
      <ol className="flex items-center gap-2 border-b border-border px-6 py-4" aria-label="Progress">
        {steps.map((st, n) => {
          const done = n < i, cur = n === i;
          return (
            <li key={st.id} className={cn("flex items-center gap-2", n < steps.length - 1 && "flex-1")} aria-current={cur ? "step" : undefined} aria-label={`Step ${n + 1}: ${st.title}${done ? " (done)" : ""}`}>
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums transition-colors", done ? "bg-accent text-accent-fg" : cur ? "border-2 border-accent text-fg" : "border border-border text-fg-subtle")}>
                {done ? <Check className="size-3.5" strokeWidth={3} /> : n + 1}
              </span>
              {cur && <span className="hidden shrink-0 whitespace-nowrap text-sm font-medium text-fg sm:block">{st.title}</span>}
              {n < steps.length - 1 && <span className={cn("h-px min-w-4 flex-1", done ? "bg-accent" : "bg-border")} aria-hidden />}
            </li>
          );
        })}
      </ol>
      <div className="p-6">
        <p className="text-xs font-medium text-fg-subtle">Step {i + 1} of {steps.length}{s.optional && " · Optional"}</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-semibold text-fg focus:outline-none">{s.title}</h2>
        {s.description && <p className="mt-1 text-base text-fg-muted">{s.description}</p>}
        <div key={s.id} className="mt-6" style={{ animation: "pl-in .2s ease-out" }}>{s.content}</div>
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-surface px-6 py-4">
        {i > 0 && <Button variant="ghost" onClick={() => go(i - 1)}>Back</Button>}
        <div className="ml-auto flex gap-2">
          {s.optional && !last && <Button variant="ghost" onClick={() => go(i + 1)}>Skip</Button>}
          <Button disabled={s.canContinue === false} onClick={() => (last ? onFinish() : go(i + 1))}>{last ? finishLabel : "Continue"}</Button>
        </div>
      </div>
    </div>
  );
}
