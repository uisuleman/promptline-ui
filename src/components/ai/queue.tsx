"use client";

import * as React from "react";
import { ArrowUp, Check, ChevronDown, GripVertical, MessageSquare, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Queue
 * Messages the user typed while the agent was busy, plus the agent's to-do list.
 * Users can send a queued message now, remove it, or let it run next.
 */
export interface QueuedMessage { id: string; text: string }
export interface Todo { id: string; text: string; done?: boolean }

export function Queue({ messages = [], todos = [], onRemove, onSendNow, onToggleTodo, className }: {
  messages?: QueuedMessage[];
  todos?: Todo[];
  onRemove?: (id: string) => void;
  onSendNow?: (id: string) => void;
  onToggleTodo?: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm", className)}>
      {messages.length > 0 && (
        <QueueSection title="Queued" count={messages.length}>
          {messages.map((m) => (
            <li key={m.id} className="group flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-surface">
              <GripVertical className="size-3.5 shrink-0 text-fg-subtle" aria-hidden />
              <MessageSquare className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-fg">{m.text}</span>
              <span className="flex gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                {onSendNow && <button type="button" onClick={() => onSendNow(m.id)} aria-label="Send now" className="grid size-6 place-items-center rounded-xs text-fg-muted hover:bg-surface-2 hover:text-fg"><ArrowUp className="size-3.5" /></button>}
                {onRemove && <button type="button" onClick={() => onRemove(m.id)} aria-label="Remove from queue" className="grid size-6 place-items-center rounded-xs text-fg-muted hover:bg-surface-2 hover:text-fg"><X className="size-3.5" /></button>}
              </span>
            </li>
          ))}
        </QueueSection>
      )}
      {todos.length > 0 && (
        <QueueSection title="To-dos" count={`${todos.filter((t) => t.done).length}/${todos.length}`} border={messages.length > 0}>
          {todos.map((t) => (
            <li key={t.id}>
              <label className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-surface">
                <input type="checkbox" checked={!!t.done} onChange={() => onToggleTodo?.(t.id)} className="peer sr-only" />
                <span className={cn("grid size-4 shrink-0 place-items-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-fg/20", t.done ? "border-fg bg-fg text-bg" : "border-border-strong")}>
                  {t.done && <Check className="size-2.5" strokeWidth={3} />}
                </span>
                <span className={cn("flex-1", t.done ? "text-fg-subtle line-through" : "text-fg")}>{t.text}</span>
              </label>
            </li>
          ))}
        </QueueSection>
      )}
    </div>
  );
}

function QueueSection({ title, count, border, children }: { title: string; count: React.ReactNode; border?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  return (
    <section className={cn(border && "border-t border-border")}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex h-10 w-full items-center gap-2 px-3 text-left text-xs font-medium text-fg-muted hover:text-fg">
        <ChevronDown className={cn("size-3.5 transition-transform", !open && "-rotate-90")} />
        {title}
        <span className="tabular-nums text-fg-subtle">{count}</span>
      </button>
      {open && <ul className="px-1 pb-2">{children}</ul>}
    </section>
  );
}
