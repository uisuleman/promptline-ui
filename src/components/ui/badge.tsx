import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Badge
 * Short status or category labels. Use semantic tones only when the colour means something.
 */
export type BadgeTone = "neutral" | "outline" | "accent" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Small leading dot — good for live status */
  dot?: boolean;
  size?: "sm" | "md";
}

export function Badge({ className, tone = "neutral", dot, size = "sm", children, ...p }: BadgeProps) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-surface-2 text-fg-muted",
    outline: "border border-border text-fg-muted",
    accent: "bg-accent text-accent-fg",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-info",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium [&_svg]:size-3", size === "sm" ? "h-5 px-2 text-2xs" : "h-6 px-2.5 text-xs", tones[tone], className)} {...p}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
