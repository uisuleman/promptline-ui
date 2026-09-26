"use client";

import * as React from "react";
import { Plus, Search, Check } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * AgentGallery
 * Pick an assistant: search, category filters and cards that say what each agent is for.
 * Cards are real buttons (arrow keys move through the grid); a dashed "Create" card is optional.
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category?: string;
  /** Short label such as "by Acme" or "Official" */
  author?: string;
  /** e.g. "12k chats" */
  meta?: string;
}

export interface AgentGalleryProps {
  agents: Agent[];
  value?: string;
  onSelect: (agent: Agent) => void;
  onCreate?: () => void;
  /** Show category filters (derived from agents) */
  filters?: boolean;
  className?: string;
}

export function AgentCard({ agent, selected, onClick, className }: { agent: Agent; selected?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} data-agent-card
      className={cn("group relative flex h-full flex-col rounded-xl border bg-bg p-4 text-left transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20",
        selected ? "border-fg shadow-sm" : "border-border hover:border-border-strong hover:shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-fg [&_svg]:size-5">{agent.icon}</span>
        {selected && <span className="grid size-5 place-items-center rounded-full bg-fg text-bg"><Check className="size-3" strokeWidth={3} /></span>}
      </div>
      <p className="mt-3 text-sm font-semibold text-fg">{agent.name}</p>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-fg-muted">{agent.description}</p>
      {(agent.author || agent.meta) && <p className="mt-3 truncate text-xs text-fg-subtle">{[agent.author, agent.meta].filter(Boolean).join(" · ")}</p>}
    </button>
  );
}

export function AgentGallery({ agents, value, onSelect, onCreate, filters = true, className }: AgentGalleryProps) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const cats = React.useMemo(() => ["All", ...Array.from(new Set(agents.map((a) => a.category).filter(Boolean) as string[]))], [agents]);
  const list = agents.filter((a) => (cat === "All" || a.category === cat) && (a.name + " " + a.description).toLowerCase().includes(q.toLowerCase()));
  const grid = React.useRef<HTMLDivElement>(null);

  const onKey = (e: React.KeyboardEvent) => {
    const cards = Array.from(grid.current?.querySelectorAll<HTMLElement>("[data-agent-card]") ?? []);
    const i = cards.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const cols = Math.max(1, Math.round(grid.current!.clientWidth / cards[0].clientWidth));
    const to = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "ArrowDown" ? i + cols : e.key === "ArrowUp" ? i - cols : -1;
    if (to >= 0 && to < cards.length) { e.preventDefault(); cards[to].focus(); }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents" aria-label="Search agents"
            className="h-9 w-full rounded-md border border-border bg-bg pl-9 pr-3 text-sm text-fg placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-4 focus:ring-fg/5" />
        </label>
        {filters && cats.length > 2 && (
          <div role="tablist" aria-label="Categories" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 sm:pb-0">
            {cats.map((c) => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                className={cn("h-8 shrink-0 rounded-full px-3 text-sm font-medium transition-colors", cat === c ? "bg-fg text-bg" : "text-fg-muted hover:bg-surface-2 hover:text-fg")}>{c}</button>
            ))}
          </div>
        )}
      </div>

      <div ref={grid} onKeyDown={onKey} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => <AgentCard key={a.id} agent={a} selected={a.id === value} onClick={() => onSelect(a)} />)}
        {onCreate && (
          <button type="button" onClick={onCreate} data-agent-card
            className="flex min-h-[9.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong p-4 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20">
            <span className="grid size-10 place-items-center rounded-lg border border-border bg-bg"><Plus className="size-5" /></span>
            Create an agent
          </button>
        )}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-sm text-fg-subtle">No agents match “{q}”.</p>}
    </div>
  );
}
