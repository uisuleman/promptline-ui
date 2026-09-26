import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Tooltip
 * Short label for icon buttons and truncated text. Shows on hover and keyboard focus.
 * Keep it to a few words; never put interactive content in a tooltip (use HoverCard).
 */
export interface TooltipProps {
  label: React.ReactNode;
  side?: "top" | "bottom";
  align?: "center" | "start" | "end";
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ label, side = "top", align = "center", children, className }: TooltipProps) {
  return (
    <span className={cn("group/tt relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 hidden whitespace-nowrap rounded-sm bg-fg px-2 py-1 text-xs font-medium text-bg shadow-sm group-hover/tt:block group-focus-within/tt:block",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          align === "center" ? "left-1/2 -translate-x-1/2" : align === "start" ? "left-0" : "right-0"
        )}
        style={{ animation: "pl-in .12s ease-out" }}
      >
        {label}
      </span>
    </span>
  );
}
