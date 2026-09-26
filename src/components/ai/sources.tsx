import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Sources
 * Collapsed by default as "Used 4 sources" with stacked favicons; expands to a list.
 * Keep it below the answer — sources support the answer, they are not the answer.
 */
export interface SourceItem { title: string; url: string; description?: string; favicon?: string }

export const hostOf = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } };

export function Favicon({ src, url, className }: { src?: string; url: string; className?: string }) {
  const [err, setErr] = React.useState(false);
  const s = src ?? `https://www.google.com/s2/favicons?domain=${hostOf(url)}&sz=32`;
  return err ? (
    <span className={cn("grid size-4 place-items-center rounded-full bg-surface-2 text-fg-subtle", className)}><Globe className="size-2.5" /></span>
  ) : (
    <img src={s} alt="" onError={() => setErr(true)} className={cn("size-4 rounded-full bg-bg ring-2 ring-bg", className)} />
  );
}

export function Sources({ sources, defaultOpen = false, className }: { sources: SourceItem[]; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  return (
    <div className={cn("text-sm", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-bg pl-2 pr-3 font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <span className="flex -space-x-1">
          {sources.slice(0, 3).map((s) => <Favicon key={s.url} url={s.url} src={s.favicon} />)}
        </span>
        Used {sources.length} source{sources.length === 1 ? "" : "s"}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <ol id={id} hidden={!open} className="mt-3 grid gap-2 sm:grid-cols-2" style={{ animation: "pl-in .2s ease-out" }}>
        {sources.map((s, i) => (
          <li key={s.url + i}>
            <a href={s.url} target="_blank" rel="noreferrer" className="flex h-full flex-col gap-1 rounded-md border border-border bg-bg p-3 transition-colors hover:border-border-strong hover:bg-surface">
              <span className="flex items-center gap-2 text-xs text-fg-subtle">
                <Favicon url={s.url} src={s.favicon} className="ring-0" />
                <span className="truncate">{hostOf(s.url)}</span>
                <span className="ml-auto tabular-nums">{i + 1}</span>
              </span>
              <span className="line-clamp-2 text-sm font-medium text-fg">{s.title}</span>
              {s.description && <span className="line-clamp-2 text-xs text-fg-muted">{s.description}</span>}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
