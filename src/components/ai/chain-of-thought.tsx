import * as React from "react";
import { ChevronDown, Dot, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { Spinner } from "../ui/spinner";
import { Shimmer } from "./loader";
import { Favicon, hostOf } from "./sources";

/**
 * ChainOfThought
 * A visible timeline of what the model did: searched, read, analysed, concluded.
 * More structured than Reasoning — each step can carry search results or images.
 */
export type StepStatus = "complete" | "active" | "pending";

export interface ChainStep {
  label: string;
  description?: string;
  icon?: LucideIcon;
  status?: StepStatus;
  /** Result chips, e.g. URLs visited */
  results?: string[];
  /** Arbitrary content, e.g. an image grid */
  content?: React.ReactNode;
}

export function ChainOfThought({ steps, title = "Chain of thought", defaultOpen = true, className }: { steps: ChainStep[]; title?: string; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const active = steps.find((s) => s.status === "active");
  const id = React.useId();
  return (
    <div className={cn("text-sm", className)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="inline-flex h-7 items-center gap-2 text-fg-muted transition-colors hover:text-fg">
        {active ? <Shimmer>{active.label}</Shimmer> : <span className="font-medium">{title}</span>}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <ol id={id} hidden={!open} className="mt-3 flex flex-col" style={{ animation: "pl-in .2s ease-out" }}>
        {steps.map((s, i) => {
          const Icon = s.icon ?? Dot;
          const status = s.status ?? "complete";
          return (
            <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
              {i < steps.length - 1 && <span aria-hidden className="absolute left-2 top-6 h-[calc(100%-20px)] w-px bg-border" />}
              <span className={cn("relative mt-0.5 grid size-4 shrink-0 place-items-center", status === "pending" ? "text-fg-subtle" : "text-fg-muted")}>
                {status === "active" ? <Spinner className="size-3.5" /> : <Icon className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn(status === "pending" ? "text-fg-subtle" : "text-fg")}>{s.label}</p>
                {s.description && <p className="mt-0.5 text-xs text-fg-muted">{s.description}</p>}
                {s.results && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.results.map((r) => (
                      <span key={r} className="inline-flex h-6 items-center gap-1.5 rounded-full border border-border bg-bg pl-1 pr-2 text-xs text-fg-muted">
                        <Favicon url={r} className="size-3.5 ring-0" />
                        {hostOf(r)}
                      </span>
                    ))}
                  </div>
                )}
                {s.content && <div className="mt-2">{s.content}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
