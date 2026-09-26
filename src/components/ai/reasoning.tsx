"use client";

import * as React from "react";
import { Brain, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { Shimmer } from "./loader";

/**
 * Reasoning
 * Model "thinking" output.
 * - While streaming: opens automatically, label shimmers "Thinking…"
 * - When done: auto-collapses to "Thought for 8s" so the answer takes focus
 * - The user can reopen it at any time
 */
export interface ReasoningProps {
  children: React.ReactNode;
  isStreaming?: boolean;
  /** Seconds — shown once finished */
  duration?: number;
  defaultOpen?: boolean;
  /** Collapse automatically when streaming ends (default true) */
  autoCollapse?: boolean;
  className?: string;
}

export function Reasoning({ children, isStreaming, duration, defaultOpen, autoCollapse = true, className }: ReasoningProps) {
  const [open, setOpen] = React.useState(defaultOpen ?? !!isStreaming);
  const was = React.useRef(isStreaming);
  const id = React.useId();

  React.useEffect(() => {
    if (isStreaming) setOpen(true);
    else if (was.current && autoCollapse) { const t = setTimeout(() => setOpen(false), 600); return () => clearTimeout(t); }
    was.current = isStreaming;
  }, [isStreaming, autoCollapse]);

  const label = isStreaming ? "Thinking…" : duration != null ? `Thought for ${duration < 60 ? `${duration}s` : `${Math.round(duration / 60)}m`}` : "Reasoning";

  return (
    <div className={cn("text-sm", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-7 items-center gap-2 rounded-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20"
      >
        <Brain className="size-4" />
        {isStreaming ? <Shimmer>{label}</Shimmer> : <span className="font-medium">{label}</span>}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div id={id} hidden={!open} className="mt-2 border-l border-border pl-4 text-sm text-fg-muted [&_p+p]:mt-2" style={{ animation: "pl-in .2s ease-out" }}>
        {children}
      </div>
    </div>
  );
}
