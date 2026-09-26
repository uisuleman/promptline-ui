import * as React from "react";
import { Check, ChevronDown, Globe, Square, Telescope } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

/**
 * ResearchProgress
 * The "deep research" view: long-running work made legible. Shows the plan's phases,
 * the sources being read right now, a live count and elapsed time, and a Stop button.
 * Collapses to a one-line summary when finished.
 */
export type PhaseStatus = "pending" | "active" | "done";
export interface ResearchPhase { id: string; label: string; status: PhaseStatus; detail?: string }
export interface ResearchSource { url: string; title?: string; status?: "reading" | "read" }

export interface ResearchProgressProps {
  query: string;
  phases: ResearchPhase[];
  sources: ResearchSource[];
  state: "running" | "done" | "stopped";
  /** Seconds elapsed — you own the clock */
  elapsed: number;
  onStop?: () => void;
  onOpenReport?: () => void;
  /** Sources shown before "+ N more" */
  visibleSources?: number;
  className?: string;
}

const domain = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
export const formatDuration = (s: number) => (s < 60 ? `${Math.floor(s)}s` : `${Math.floor(s / 60)}m ${String(Math.floor(s % 60)).padStart(2, "0")}s`);

export function ResearchProgress({ query, phases, sources, state, elapsed, onStop, onOpenReport, visibleSources = 5, className }: ResearchProgressProps) {
  const [open, setOpen] = React.useState(true);
  const [allSources, setAllSources] = React.useState(false);
  const running = state === "running";
  const read = sources.filter((s) => s.status !== "reading").length;
  React.useEffect(() => { if (!running) setOpen(false); }, [running]);
  const shown = allSources ? sources : sources.slice(-visibleSources).reverse();

  return (
    <section aria-label="Research progress" className={cn("w-full overflow-hidden rounded-xl border border-border bg-bg", className)}>
      <div className="flex items-center gap-3 p-4">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg border border-border", running ? "bg-surface text-fg" : "bg-success/10 text-success border-success/20")}>
          {running ? <Telescope className="size-4" /> : <Check className="size-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-medium text-fg", running && "pl-shimmer-text")}>{running ? "Researching" : state === "stopped" ? "Research stopped" : "Research complete"}</p>
          <p className="truncate text-xs text-fg-muted" aria-live="polite">
            <span className="tabular-nums">{read}</span> sources · <span className="tabular-nums">{formatDuration(elapsed)}</span>
          </p>
        </div>
        {running && onStop && <Button size="sm" variant="outline" onClick={onStop}><Square className="!size-3 fill-current" />Stop</Button>}
        {!running && onOpenReport && <Button size="sm" onClick={onOpenReport}>Open report</Button>}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Hide details" : "Show details"} className="grid size-8 shrink-0 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg">
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="grid border-t border-border sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="p-4">
            <p className="mb-3 line-clamp-2 text-xs text-fg-subtle">“{query}”</p>
            <ol className="space-y-0">
              {phases.map((p, i) => (
                <li key={p.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < phases.length - 1 && <span aria-hidden className={cn("absolute left-[9px] top-6 h-[calc(100%-20px)] w-px", p.status === "done" ? "bg-fg/30" : "bg-border")} />}
                  <span className={cn("relative z-[1] mt-0.5 grid size-[19px] shrink-0 place-items-center rounded-full border",
                    p.status === "done" ? "border-fg bg-fg text-bg" : p.status === "active" ? "border-fg bg-bg" : "border-border bg-bg")}>
                    {p.status === "done" ? <Check className="size-3" strokeWidth={3} /> : p.status === "active" ? <Spinner className="size-3" /> : null}
                  </span>
                  <div className="min-w-0">
                    <p className={cn("text-sm", p.status === "pending" ? "text-fg-subtle" : "text-fg", p.status === "active" && "font-medium")}>{p.label}</p>
                    {p.detail && p.status !== "pending" && <p className="mt-0.5 text-xs text-fg-muted">{p.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-t border-border bg-surface/60 p-4 sm:border-l sm:border-t-0">
            <p className="mb-2 text-xs font-medium text-fg-subtle">Sources</p>
            {sources.length === 0 ? <p className="py-3 text-sm text-fg-subtle">Searching…</p> : (
              <ul className={cn("space-y-1", allSources && "max-h-64 overflow-y-auto")}>
                {shown.map((s) => (
                  <li key={s.url} style={{ animation: "pl-in .25s ease-out" }}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-surface-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-xs border border-border bg-bg text-2xs font-semibold uppercase text-fg-muted">{domain(s.url)[0]}</span>
                      <span className={cn("min-w-0 flex-1 truncate text-sm", s.status === "reading" ? "pl-shimmer-text" : "text-fg")}>{s.title ?? domain(s.url)}</span>
                      {s.title && <span className="hidden shrink-0 text-xs text-fg-subtle sm:inline">{domain(s.url)}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {sources.length > visibleSources && (
              <button type="button" onClick={() => setAllSources((a) => !a)} className="mt-2 inline-flex items-center gap-1.5 px-1.5 text-xs font-medium text-fg-muted hover:text-fg">
                <Globe className="size-3.5" />{allSources ? "Show recent" : `+ ${sources.length - visibleSources} more`}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
