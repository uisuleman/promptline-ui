import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Skeleton
 * Shimmer placeholders that match the real layout's shape, so nothing jumps when data arrives.
 * Use for loading a saved conversation, history list, or any card — not for waiting on the model
 * (use Loader for that).
 */
export function Skeleton({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-sm bg-surface-2", className)} {...p}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-fg/[0.05] to-transparent" style={{ animation: "pl-shimmer-x 1.6s infinite" }} />
    </div>
  );
}

export function MessageSkeleton({ from = "assistant", lines = 3, className }: { from?: "user" | "assistant"; lines?: number; className?: string }) {
  if (from === "user") return <div className={cn("flex justify-end", className)}><Skeleton className="h-10 w-2/5 rounded-xl" /></div>;
  const w = ["w-full", "w-11/12", "w-4/5", "w-3/4"];
  return (
    <div className={cn("flex gap-4", className)}>
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-3 pt-1.5">
        {Array.from({ length: lines }).map((_, i) => <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/5" : w[i % w.length])} />)}
      </div>
    </div>
  );
}

export function ConversationSkeleton({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading conversation" className={cn("flex flex-col gap-8", className)}>
      <MessageSkeleton from="user" />
      <MessageSkeleton lines={4} />
      <MessageSkeleton from="user" />
      <MessageSkeleton lines={2} />
    </div>
  );
}
