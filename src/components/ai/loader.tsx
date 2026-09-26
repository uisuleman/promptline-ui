import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Loader & streaming states
 * - <Loader variant="dots" | "pulse" | "bars" /> before the first token (show within 300ms of submit)
 * - <Shimmer>Searching the web…</Shimmer> for live status text
 * - <StreamingCursor/> appended to text while it streams
 */
export function Loader({ variant = "dots", label, className }: { variant?: "dots" | "pulse" | "bars"; label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("inline-flex items-center gap-2 text-sm text-fg-muted", className)}>
      {variant === "dots" && (
        <span className="inline-flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-current" style={{ animation: `pl-bounce 1.2s ${i * 0.15}s infinite ease-in-out` }} />)}
        </span>
      )}
      {variant === "pulse" && <span aria-hidden className="size-3 rounded-full bg-fg" style={{ animation: "pl-pulse 1.4s ease-in-out infinite" }} />}
      {variant === "bars" && (
        <span className="inline-flex h-4 items-center gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => <span key={i} className="h-full w-[3px] origin-center rounded-full bg-current" style={{ animation: `pl-wave 1s ${i * 0.12}s infinite ease-in-out` }} />)}
        </span>
      )}
      {label ? <Shimmer>{label}</Shimmer> : <span className="sr-only">Generating response</span>}
    </div>
  );
}

export function Shimmer({ children, className, as: Tag = "span" }: { children: React.ReactNode; className?: string; as?: "span" | "p" }) {
  return <Tag className={cn("pl-shimmer-text font-medium", className)}>{children}</Tag>;
}

export function StreamingCursor({ className }: { className?: string }) {
  return <span aria-hidden className={cn("ml-0.5 inline-block h-[1em] w-2 translate-y-[2px] rounded-[1px] bg-fg", className)} style={{ animation: "pl-blink 1s steps(2) infinite" }} />;
}
