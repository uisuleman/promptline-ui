import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Kbd
 * Keyboard keys and shortcuts. Use <KbdGroup keys={["⌘","K"]}/> for combos.
 */
export function Kbd({ className, ...p }: React.HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-border bg-surface px-1 font-sans text-2xs font-medium text-fg-muted shadow-[inset_0_-1px_0_rgb(var(--border))]", className)} {...p} />;
}

export function KbdGroup({ keys, className }: { keys: string[]; className?: string }) {
  return <span className={cn("inline-flex items-center gap-0.5", className)}>{keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>;
}
