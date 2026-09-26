"use client";

import * as React from "react";
import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { Kbd } from "../ui/kbd";
import { Dialog } from "../ui/dialog";

/**
 * CommandBar
 * ⌘K palette that blends commands with AI: typing filters commands, and the first row is
 * always "Ask AI: <query>" so any question has somewhere to go.
 * Opens with ⌘K / Ctrl+K when `hotkey` is true.
 */
export interface Command { id: string; label: string; group?: string; icon?: React.ReactNode; shortcut?: string[] }

export interface CommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
  onCommand: (id: string) => void;
  /** Omit to hide the "Ask AI" row (plain command palette) */
  onAsk?: (query: string) => void;
  placeholder?: string;
  hotkey?: boolean;
}

export function CommandBar({ open, onOpenChange, commands, onCommand, onAsk, placeholder = "Search or ask AI…", hotkey = true }: CommandBarProps) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (!hotkey) return;
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); onOpenChange(!open); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [hotkey, open, onOpenChange]);
  React.useEffect(() => { if (open) { setQ(""); setActive(0); } }, [open]);

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  const rows: ({ kind: "ask" } | { kind: "cmd"; c: Command })[] = [...(q.trim() && onAsk ? [{ kind: "ask" as const }] : []), ...filtered.map((c) => ({ kind: "cmd" as const, c }))];
  const run = (i: number) => {
    const r = rows[i];
    if (!r) return;
    r.kind === "ask" ? onAsk?.(q) : onCommand(r.c.id);
    onOpenChange(false);
  };
  React.useEffect(() => { listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  let lastGroup: string | undefined;
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} label="Command bar" position="top" showClose={false} className="max-w-xl overflow-hidden">
      <div
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, rows.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          if (e.key === "Enter") { e.preventDefault(); run(active); }
        }}
      >
        <label className="flex h-12 items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-fg-subtle" />
          <input data-autofocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} placeholder={placeholder} aria-label="Search or ask" className="min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-fg-subtle focus:outline-none" />
          <Kbd>Esc</Kbd>
        </label>
        <ul ref={listRef} role="listbox" className="max-h-80 overflow-y-auto p-2">
          {rows.map((r, i) => {
            if (r.kind === "ask")
              return (
                <li key="ask" data-i={i} role="option" aria-selected={active === i} onMouseEnter={() => setActive(i)} onClick={() => run(i)} className={cn("flex h-11 cursor-pointer items-center gap-3 rounded-md px-3", active === i && "bg-surface-2")}>
                  <span className="grid size-6 place-items-center rounded-sm bg-fg text-bg"><Sparkles className="size-3.5" /></span>
                  <span className="min-w-0 flex-1 truncate text-base text-fg">Ask AI: <span className="font-medium">{q}</span></span>
                  <ArrowRight className="size-4 text-fg-subtle" />
                </li>
              );
            const showGroup = r.c.group && r.c.group !== lastGroup;
            lastGroup = r.c.group;
            return (
              <React.Fragment key={r.c.id}>
                {showGroup && <li role="presentation" className="px-3 pb-1 pt-3 text-xs font-medium text-fg-subtle">{r.c.group}</li>}
                <li data-i={i} role="option" aria-selected={active === i} onMouseEnter={() => setActive(i)} onClick={() => run(i)} className={cn("flex h-9 cursor-pointer items-center gap-3 rounded-md px-3 text-base text-fg-muted", active === i && "bg-surface-2 text-fg")}>
                  <span className="text-fg-subtle [&_svg]:size-4">{r.c.icon}</span>
                  <span className="flex-1 truncate">{r.c.label}</span>
                  {r.c.shortcut && <span className="flex gap-1">{r.c.shortcut.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>}
                </li>
              </React.Fragment>
            );
          })}
          {!rows.length && <li className="px-3 py-8 text-center text-sm text-fg-subtle">{q ? "No results" : "Type to search"}</li>}
        </ul>
        <div className="flex h-10 items-center gap-4 border-t border-border bg-surface px-4 text-xs text-fg-subtle">
          <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd>navigate</span>
          <span className="flex items-center gap-1"><Kbd><CornerDownLeft className="size-2.5" /></Kbd>select</span>
        </div>
      </div>
    </Dialog>
  );
}
