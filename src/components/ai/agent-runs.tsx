import * as React from "react";
import { Check, Clock, RotateCcw, Square, X, ChevronRight, CircleDashed } from "lucide-react";
import { cn } from "../../lib/cn";
import { Spinner } from "../ui/spinner";
import { Tabs } from "../ui/tabs";
import { Button } from "../ui/button";
import { RelativeTime } from "./relative-time";

/**
 * AgentRuns
 * Background agent jobs: what's running, what finished, what failed — with time, cost and
 * one-click Stop / Retry. Running jobs show live progress; failures show why.
 */
export type RunStatus = "queued" | "running" | "completed" | "failed" | "stopped";
export interface AgentRun { id: string; title: string; status: RunStatus; startedAt: Date; durationSec?: number; progress?: number; step?: string; cost?: number; error?: string }

export interface AgentRunsProps {
  runs: AgentRun[];
  onStop?: (id: string) => void;
  onRetry?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
}

const statusUI: Record<RunStatus, { icon: React.ReactNode; label: string; cls: string }> = {
  queued: { icon: <CircleDashed className="size-4" />, label: "Queued", cls: "text-fg-subtle" },
  running: { icon: <Spinner className="size-4" />, label: "Running", cls: "text-info" },
  completed: { icon: <Check className="size-4" />, label: "Completed", cls: "text-success" },
  failed: { icon: <X className="size-4" />, label: "Failed", cls: "text-danger" },
  stopped: { icon: <Square className="size-3.5" />, label: "Stopped", cls: "text-fg-muted" },
};
const dur = (s?: number) => (s == null ? "" : s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);

export function AgentRuns({ runs, onStop, onRetry, onOpen, className }: AgentRunsProps) {
  const [filter, setFilter] = React.useState("all");
  const count = (s: RunStatus[]) => runs.filter((r) => s.includes(r.status)).length;
  const shown = runs.filter((r) => filter === "all" || (filter === "active" ? ["running", "queued"].includes(r.status) : filter === "done" ? r.status === "completed" : ["failed", "stopped"].includes(r.status)));
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg", className)}>
      <div className="px-4 pt-2">
        <Tabs
          size="sm"
          value={filter}
          onValueChange={setFilter}
          items={[
            { value: "all", label: "All", badge: <span className="text-fg-subtle tabular-nums">{runs.length}</span> },
            { value: "active", label: "Active", badge: <span className="text-fg-subtle tabular-nums">{count(["running", "queued"])}</span> },
            { value: "done", label: "Completed" },
            { value: "failed", label: "Failed", badge: count(["failed"]) ? <span className="tabular-nums text-danger">{count(["failed"])}</span> : undefined },
          ]}
        />
      </div>
      <ul className="divide-y divide-border">
        {shown.map((r) => {
          const s = statusUI[r.status];
          return (
            <li key={r.id} className="group flex items-start gap-3 px-4 py-3">
              <span className={cn("mt-0.5 shrink-0", s.cls)} aria-label={s.label}>{s.icon}</span>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => onOpen?.(r.id)} className="block max-w-full truncate text-left text-sm font-medium text-fg hover:underline">{r.title}</button>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-fg-subtle">
                  <span className={s.cls}>{s.label}</span>
                  <span>·</span><RelativeTime date={r.startedAt} />
                  {r.durationSec != null && <><span>·</span><span className="inline-flex items-center gap-1 tabular-nums"><Clock className="size-3" />{dur(r.durationSec)}</span></>}
                  {r.cost != null && <><span>·</span><span className="tabular-nums">${r.cost.toFixed(2)}</span></>}
                </p>
                {r.status === "running" && (
                  <div className="mt-2 space-y-1">
                    {r.step && <p className="truncate text-xs text-fg-muted">{r.step}</p>}
                    <div className="h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-info transition-[width] duration-500" style={{ width: `${r.progress ?? 10}%` }} /></div>
                  </div>
                )}
                {r.status === "failed" && r.error && <p className="mt-1.5 rounded-sm bg-danger/[0.05] px-2 py-1 font-mono text-xs text-danger">{r.error}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {r.status === "running" && onStop && <Button size="xs" variant="outline" onClick={() => onStop(r.id)}><Square className="!size-3" />Stop</Button>}
                {(r.status === "failed" || r.status === "stopped") && onRetry && <Button size="xs" variant="outline" onClick={() => onRetry(r.id)}><RotateCcw />Retry</Button>}
                {onOpen && <button type="button" onClick={() => onOpen(r.id)} aria-label={`Open ${r.title}`} className="grid size-7 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><ChevronRight className="size-4" /></button>}
              </div>
            </li>
          );
        })}
        {!shown.length && <li className="px-4 py-10 text-center text-sm text-fg-subtle">Nothing here</li>}
      </ul>
    </div>
  );
}
