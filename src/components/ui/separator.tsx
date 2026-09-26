import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Separator
 * Hairline divider. Pass `label` for "or" dividers in forms. Decorative by default.
 */
export function Separator({ className, vertical, label, decorative = true }: { className?: string; vertical?: boolean; label?: React.ReactNode; decorative?: boolean }) {
  const a11y = decorative ? { role: "none" as const } : { role: "separator" as const, "aria-orientation": vertical ? ("vertical" as const) : ("horizontal" as const) };
  if (label && !vertical)
    return (
      <div {...a11y} className={cn("flex items-center gap-3 text-xs text-fg-subtle", className)}>
        <span className="h-px flex-1 bg-border" />{label}<span className="h-px flex-1 bg-border" />
      </div>
    );
  return <div {...a11y} className={cn("shrink-0 bg-border", vertical ? "h-full w-px self-stretch" : "h-px w-full", className)} />;
}
