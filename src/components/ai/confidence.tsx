import * as React from "react";
import { AlertTriangle, CircleCheck, CircleHelp, ExternalLink } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Confidence & Verify
 * Honest signals about how much to trust an answer.
 * - <ConfidenceBadge level/> next to a claim or at the top of a result
 * - <VerifyNote/> under answers in high-stakes domains (medical, legal, finance, numbers)
 * Only show confidence if your system can actually estimate it — fake confidence erodes trust.
 */
export type ConfidenceLevel = "high" | "medium" | "low";

const meta: Record<ConfidenceLevel, { label: string; cls: string; Icon: typeof CircleCheck; hint: string }> = {
  high: { label: "High confidence", cls: "bg-success/10 text-success", Icon: CircleCheck, hint: "Backed by multiple consistent sources." },
  medium: { label: "Medium confidence", cls: "bg-warning/10 text-warning", Icon: CircleHelp, hint: "Some sources disagree or are dated." },
  low: { label: "Low confidence", cls: "bg-danger/10 text-danger", Icon: AlertTriangle, hint: "Limited or conflicting evidence. Verify before relying on this." },
};

export function ConfidenceBadge({ level, showHint, className }: { level: ConfidenceLevel; showHint?: boolean; className?: string }) {
  const m = meta[level];
  return (
    <span className={cn("inline-flex flex-col gap-1", className)}>
      <span className={cn("inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2.5 text-xs font-medium", m.cls)} title={m.hint}>
        <m.Icon className="size-3.5" />{m.label}
      </span>
      {showHint && <span className="text-xs text-fg-subtle">{m.hint}</span>}
    </span>
  );
}

export function VerifyNote({ children, href, linkLabel = "Learn more", className }: { children?: React.ReactNode; href?: string; linkLabel?: string; className?: string }) {
  return (
    <p className={cn("flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs text-fg-muted", className)}>
      <AlertTriangle className="mt-px size-3.5 shrink-0 text-warning" />
      <span>
        {children ?? "AI can make mistakes. Double-check important facts with a qualified source."}
        {href && <a href={href} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-0.5 font-medium text-fg underline-offset-4 hover:underline">{linkLabel}<ExternalLink className="size-3" /></a>}
      </span>
    </p>
  );
}

/** Highlight a span the model is unsure about; hover explains why. */
export function UncertainText({ children, reason }: { children: React.ReactNode; reason: string }) {
  return (
    <mark title={reason} className="cursor-help rounded-xs bg-warning/15 px-0.5 text-inherit underline decoration-warning/60 decoration-dotted underline-offset-4">{children}</mark>
  );
}
