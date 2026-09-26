"use client";

import * as React from "react";
import { Check, ChevronDown, Lock, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { useDismiss } from "../../lib/hooks";
import { Badge } from "../ui/badge";

/**
 * ModelSelector
 * Grouped by provider, searchable when there are more than 6 models,
 * capability badges, and locked models that route to your paywall.
 * Keyboard: ↑ ↓ move · Enter select · Esc close.
 */
export interface ModelOption {
  id: string;
  name: string;
  provider?: string;
  description?: string;
  badges?: string[];
  locked?: boolean;
  icon?: React.ReactNode;
}

export interface ModelSelectorProps {
  models: ModelOption[];
  value: string;
  onValueChange: (id: string) => void;
  onLockedSelect?: (id: string) => void;
  side?: "top" | "bottom";
  align?: "start" | "end";
  defaultOpen?: boolean;
  className?: string;
}

export function ModelSelector({ models, value, onValueChange, onLockedSelect, side = "top", align = "start", defaultOpen = false, className }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  useDismiss(open, React.useCallback(() => setOpen(false), []), root);

  const current = models.find((m) => m.id === value) ?? models[0];
  const filtered = models.filter((m) => `${m.name} ${m.provider ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const groups = filtered.reduce<[string, ModelOption[]][]>((acc, m) => {
    const g = m.provider ?? "";
    const found = acc.find(([k]) => k === g);
    found ? found[1].push(m) : acc.push([g, [m]]);
    return acc;
  }, []);
  const flat = groups.flatMap(([, ms]) => ms);

  const pick = (m?: ModelOption) => {
    if (!m) return;
    m.locked ? onLockedSelect?.(m.id) : onValueChange(m.id);
    setOpen(false); setQ("");
  };

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      onKeyDown={(e) => {
        if (!open) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % flat.length); }
        if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % flat.length); }
        if (e.key === "Enter") { e.preventDefault(); pick(flat[active]); }
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => { setOpen((o) => !o); setActive(Math.max(0, flat.indexOf(current))); }}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm px-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 [&_svg]:size-4"
      >
        {current?.icon}
        {current?.name}
        <ChevronDown className={cn("!size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn("absolute z-50 w-72 overflow-hidden rounded-lg border border-border bg-bg shadow-lg", side === "top" ? "bottom-full mb-2" : "top-full mt-2", align === "end" ? "right-0" : "left-0")}
          style={{ animation: "pl-pop .15s var(--ease-out)" }}
        >
          {models.length > 6 && (
            <label className="flex h-10 items-center gap-2 border-b border-border px-3 text-fg-subtle">
              <Search className="size-4" />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} placeholder="Search models…" className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none" />
            </label>
          )}
          <ul id={listId} role="listbox" aria-label="Models" className="max-h-80 overflow-y-auto p-1">
            {groups.map(([g, ms]) => (
              <li key={g} role="presentation">
                {g && <p className="px-2 pb-1 pt-2 text-xs font-medium text-fg-subtle">{g}</p>}
                <ul role="group">
                  {ms.map((m) => {
                    const i = flat.indexOf(m);
                    return (
                      <li
                        key={m.id}
                        role="option"
                        aria-selected={m.id === value}
                        aria-disabled={m.locked || undefined}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => pick(m)}
                        className={cn("flex cursor-pointer items-start gap-3 rounded-sm px-2 py-2", i === active && "bg-surface-2")}
                      >
                        {m.icon && <span className="mt-0.5 text-fg-muted [&_svg]:size-4">{m.icon}</span>}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={cn("text-sm font-medium", m.locked ? "text-fg-muted" : "text-fg")}>{m.name}</span>
                            {m.badges?.map((b) => <Badge key={b} tone="outline">{b}</Badge>)}
                          </div>
                          {m.description && <p className="text-xs text-fg-subtle">{m.description}</p>}
                        </div>
                        <span className="mt-0.5 shrink-0 text-fg-muted">
                          {m.locked ? <Lock className="size-3.5" /> : m.id === value ? <Check className="size-4 text-fg" /> : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
            {!flat.length && <li className="px-2 py-6 text-center text-sm text-fg-subtle">No models found</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
