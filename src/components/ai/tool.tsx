import * as React from "react";
import { Check, ChevronDown, CircleDashed, Clock, ShieldQuestion, Wrench, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";
import { CodeBlock } from "./code-block";

/**
 * Tool
 * One tool/function call. Collapsed header shows name + status; expanding reveals
 * parameters and the result (or error). Matches the AI SDK tool-invocation states.
 */
export type ToolState = "pending" | "running" | "awaiting-approval" | "completed" | "error" | "denied";

const stateMeta: Record<ToolState, { label: string; tone: React.ComponentProps<typeof Badge>["tone"]; icon: React.ReactNode }> = {
  pending: { label: "Pending", tone: "neutral", icon: <CircleDashed /> },
  running: { label: "Running", tone: "info", icon: <Spinner className="size-3" /> },
  "awaiting-approval": { label: "Needs approval", tone: "warning", icon: <ShieldQuestion /> },
  completed: { label: "Completed", tone: "success", icon: <Check /> },
  error: { label: "Error", tone: "danger", icon: <X /> },
  denied: { label: "Denied", tone: "neutral", icon: <X /> },
};

export interface ToolProps {
  name: string;
  /** Human title, e.g. "Searched the web" — falls back to name */
  title?: string;
  state: ToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  duration?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  /** Custom output renderer — e.g. a weather card instead of JSON */
  children?: React.ReactNode;
  className?: string;
}

const json = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v, null, 2));

export function Tool({ name, title, state, input, output, errorText, duration, icon, defaultOpen, children, className }: ToolProps) {
  const [open, setOpen] = React.useState(defaultOpen ?? (state === "error" || state === "awaiting-approval"));
  const id = React.useId();
  const m = stateMeta[state];
  const hasBody = input !== undefined || output !== undefined || errorText || children;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm", className)}>
      <button
        type="button"
        aria-expanded={hasBody ? open : undefined}
        aria-controls={id}
        disabled={!hasBody}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center gap-3 px-3 text-left transition-colors enabled:hover:bg-surface disabled:cursor-default"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-sm bg-surface-2 text-fg-muted [&_svg]:size-3.5">{icon ?? <Wrench />}</span>
        <span className="min-w-[3rem] flex-1 truncate font-medium text-fg">{title ?? name}</span>
        {title && <code className="hidden min-w-0 shrink-[2] truncate font-mono text-xs text-fg-subtle lg:inline">{name}</code>}
        {duration && <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-fg-subtle"><Clock className="size-3" />{duration}</span>}
        <Badge tone={m.tone} className="shrink-0">{m.icon}{m.label}</Badge>
        {hasBody && <ChevronDown className={cn("size-4 shrink-0 text-fg-subtle transition-transform duration-200", open && "rotate-180")} />}
      </button>
      {hasBody && (
        <div id={id} hidden={!open} className="space-y-3 border-t border-border bg-surface p-3">
          {input !== undefined && <ToolSection label="Parameters"><CodeBlock code={json(input)} language="json" className="bg-bg" /></ToolSection>}
          {errorText && <ToolSection label="Error"><div className="rounded-md border border-danger/20 bg-danger/5 p-3 font-mono text-xs text-danger">{errorText}</div></ToolSection>}
          {children ? <ToolSection label="Result">{children}</ToolSection> : output !== undefined && <ToolSection label="Result"><CodeBlock code={json(output)} language="json" className="bg-bg" maxHeight={240} /></ToolSection>}
        </div>
      )}
    </div>
  );
}

function ToolSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">{label}</p>
      {children}
    </div>
  );
}
