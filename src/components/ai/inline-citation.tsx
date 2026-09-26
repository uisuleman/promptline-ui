import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Favicon, hostOf, type SourceItem } from "./sources";

/**
 * InlineCitation
 * A pill placed right after the claim it supports: "…reduces wait time [nngroup.com +1]".
 * Hover or focus opens a preview card; multiple sources page with ‹ ›.
 * Show the domain, not a bare number — users trust names, not footnotes.
 */
export function InlineCitation({ sources, className }: { sources: SourceItem[]; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [i, setI] = React.useState(0);
  const t = React.useRef<number | undefined>(undefined);
  const show = () => { window.clearTimeout(t.current); setOpen(true); };
  const hide = () => { t.current = window.setTimeout(() => setOpen(false), 120); };
  const s = sources[i];
  if (!s) return null;

  return (
    <span className={cn("relative inline-block align-baseline", className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <a
        href={sources[0].url}
        target="_blank"
        rel="noreferrer"
        className="ml-1 inline-flex h-5 items-center gap-1 rounded-full bg-surface-2 px-2 align-[1px] text-2xs font-medium text-fg-muted no-underline transition-colors hover:bg-fg hover:text-bg"
      >
        {hostOf(sources[0].url)}
        {sources.length > 1 && <span className="opacity-70">+{sources.length - 1}</span>}
      </a>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-2 block w-72 rounded-lg border border-border bg-bg p-3 text-left shadow-lg"
          style={{ animation: "pl-pop .15s var(--ease-out)" }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {sources.length > 1 && (
            <span className="mb-2 flex items-center justify-between text-xs text-fg-subtle">
              <span className="tabular-nums">{i + 1} of {sources.length}</span>
              <span className="flex gap-1">
                <button type="button" aria-label="Previous source" onClick={() => setI((i - 1 + sources.length) % sources.length)} className="grid size-6 place-items-center rounded-xs hover:bg-surface-2 hover:text-fg"><ChevronLeft className="size-3.5" /></button>
                <button type="button" aria-label="Next source" onClick={() => setI((i + 1) % sources.length)} className="grid size-6 place-items-center rounded-xs hover:bg-surface-2 hover:text-fg"><ChevronRight className="size-3.5" /></button>
              </span>
            </span>
          )}
          <a href={s.url} target="_blank" rel="noreferrer" className="block no-underline">
            <span className="flex items-center gap-2 text-xs text-fg-subtle"><Favicon url={s.url} src={s.favicon} className="ring-0" />{hostOf(s.url)}</span>
            <span className="mt-1 block text-sm font-medium text-fg">{s.title}</span>
            {s.description && <span className="mt-1 line-clamp-3 block text-xs text-fg-muted">{s.description}</span>}
          </a>
        </span>
      )}
    </span>
  );
}
