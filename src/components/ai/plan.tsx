import * as React from "react";
import { Check, ChevronDown, ListTodo } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Shimmer } from "./loader";

/**
 * Plan
 * The agent proposes a plan before acting. Users can review, edit, then run it.
 * While executing, each step shows progress so the plan doubles as a progress view.
 */
export type PlanStepStatus = "todo" | "doing" | "done";
export interface PlanStep { title: string; detail?: string; status?: PlanStepStatus }

export interface PlanProps {
  title: string;
  summary?: string;
  steps: PlanStep[];
  isStreaming?: boolean;
  /** Primary action e.g. "Run plan" — hidden once any step is in progress */
  onRun?: () => void;
  onEdit?: () => void;
  runLabel?: string;
  defaultOpen?: boolean;
  className?: string;
}

export function Plan({ title, summary, steps, isStreaming, onRun, onEdit, runLabel = "Run plan", defaultOpen = true, className }: PlanProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const done = steps.filter((s) => s.status === "done").length;
  const started = steps.some((s) => s.status && s.status !== "todo");
  const id = React.useId();

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm", className)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-surface">
        <ListTodo className="mt-0.5 size-4 shrink-0 text-fg-muted" />
        <div className="min-w-0 flex-1">
          {isStreaming ? <Shimmer className="text-base">{title}</Shimmer> : <p className="text-base font-medium text-fg">{title}</p>}
          {summary && <p className="mt-1 text-fg-muted">{summary}</p>}
        </div>
        {started && <span className="mt-0.5 text-xs tabular-nums text-fg-subtle">{done}/{steps.length}</span>}
        <ChevronDown className={cn("mt-0.5 size-4 shrink-0 text-fg-subtle transition-transform", open && "rotate-180")} />
      </button>
      <div id={id} hidden={!open}>
        {started && (
          <div className="mx-4 h-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={done} aria-valuemax={steps.length} aria-valuemin={0}>
            <div className="h-full rounded-full bg-fg transition-[width] duration-500" style={{ width: `${(done / steps.length) * 100}%` }} />
          </div>
        )}
        <ol className="space-y-3 p-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3" style={isStreaming ? { animation: `pl-in .25s ${i * 0.05}s both` } : undefined}>
              <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-2xs font-medium tabular-nums", s.status === "done" ? "border-fg bg-fg text-bg" : s.status === "doing" ? "border-fg text-fg" : "border-border text-fg-subtle")}>
                {s.status === "done" ? <Check className="size-3" strokeWidth={3} /> : s.status === "doing" ? <Spinner className="size-3" /> : i + 1}
              </span>
              <div className="min-w-0">
                <p className={cn(s.status === "done" ? "text-fg-muted line-through decoration-fg-subtle" : "text-fg")}>{s.title}</p>
                {s.detail && <p className="mt-0.5 text-xs text-fg-subtle">{s.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
        {!started && !isStreaming && (onRun || onEdit) && (
          <div className="flex justify-end gap-2 border-t border-border bg-surface px-4 py-3">
            {onEdit && <Button size="sm" variant="outline" onClick={onEdit}>Edit plan</Button>}
            {onRun && <Button size="sm" onClick={onRun}>{runLabel}</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
