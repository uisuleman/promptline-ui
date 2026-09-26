import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Pagination
 * Page numbers with ellipses: 1 … 4 5 6 … 20. Always shows first, last, current and `siblings` around it.
 * Use for tables and history lists; prefer "Load more" / infinite scroll for feeds.
 */
export function pageRange(page: number, total: number, siblings = 1): (number | "…")[] {
  const size = siblings * 2 + 5;
  if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);
  const l = Math.max(page - siblings, 2), r = Math.min(page + siblings, total - 1);
  const out: (number | "…")[] = [1];
  if (l > 2) out.push("…");
  for (let i = l; i <= r; i++) out.push(i);
  if (r < total - 1) out.push("…");
  out.push(total);
  return out;
}

export interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  /** "numbers" shows pages, "simple" shows "Page 2 of 10" */
  variant?: "numbers" | "simple";
  className?: string;
}

export function Pagination({ page, total, onPageChange, siblings = 1, variant = "numbers", className }: PaginationProps) {
  const btn = "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-sm px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 disabled:pointer-events-none disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button type="button" className={cn(btn, "pr-3 text-fg-muted hover:bg-surface-2 hover:text-fg")} disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="size-4" /><span className="hidden sm:inline">Previous</span>
      </button>
      {variant === "simple" ? (
        <span className="px-2 text-sm tabular-nums text-fg-muted">Page {page} of {total}</span>
      ) : (
        pageRange(page, total, siblings).map((p, i) =>
          p === "…" ? <span key={`e${i}`} className="grid h-8 min-w-8 place-items-center text-sm text-fg-subtle" aria-hidden>…</span> : (
            <button key={p} type="button" aria-current={p === page ? "page" : undefined} aria-label={`Page ${p}`} onClick={() => onPageChange(p)}
              className={cn(btn, "tabular-nums", p === page ? "border border-border bg-bg text-fg shadow-xs" : "text-fg-muted hover:bg-surface-2 hover:text-fg")}>
              {p}
            </button>
          )
        )
      )}
      <button type="button" className={cn(btn, "pl-3 text-fg-muted hover:bg-surface-2 hover:text-fg")} disabled={page >= total} onClick={() => onPageChange(page + 1)} aria-label="Next page">
        <span className="hidden sm:inline">Next</span><ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
