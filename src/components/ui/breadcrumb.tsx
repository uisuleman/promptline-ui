import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Breadcrumb
 * Where you are in a hierarchy (Workspace / Project / Chat). The last item is the current page.
 * Long trails collapse the middle into "…" (maxItems), keeping the first and last items visible.
 */
export interface Crumb { label: React.ReactNode; href?: string; onClick?: () => void; icon?: React.ReactNode }

export function Breadcrumb({ items, maxItems = 4, separator, className }: { items: Crumb[]; maxItems?: number; separator?: React.ReactNode; className?: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const collapse = !expanded && items.length > maxItems;
  const shown: (Crumb | "…")[] = collapse ? [items[0], "…", ...items.slice(-(maxItems - 2))] : items;
  const sep = separator ?? <ChevronRight className="size-3.5 text-fg-subtle" />;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {shown.map((c, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-1.5">
              {c === "…" ? (
                <button type="button" onClick={() => setExpanded(true)} aria-label="Show full path" className="grid size-6 place-items-center rounded-xs text-fg-muted hover:bg-surface-2 hover:text-fg"><MoreHorizontal className="size-4" /></button>
              ) : last ? (
                <span aria-current="page" className="inline-flex items-center gap-1.5 font-medium text-fg [&_svg]:size-4">{c.icon}{c.label}</span>
              ) : (
                <a href={c.href} onClick={c.onClick} className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg [&_svg]:size-4">{c.icon}{c.label}</a>
              )}
              {!last && <span aria-hidden>{sep}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
