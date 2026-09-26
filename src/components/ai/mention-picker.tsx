"use client";

import * as React from "react";
import { AtSign, Bot, FileText, User, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * MentionPicker
 * Type "@" to reference a file, agent or person. The chosen item becomes a context chip
 * (render `MentionChip`s in the input's attachments slot) and the "@query" text is removed.
 * Wraps any text input through a render prop: pass the provided `onKeyDown` to it.
 */
export type MentionType = "file" | "agent" | "person";

export interface MentionItem {
  id: string;
  label: string;
  type?: MentionType;
  description?: string;
  icon?: React.ReactNode;
}

export interface MentionPickerProps {
  value: string;
  onValueChange: (v: string) => void;
  items: MentionItem[];
  onSelect: (item: MentionItem) => void;
  /** Ids already mentioned — hidden from the list */
  selected?: string[];
  children: (input: { onKeyDown: (e: React.KeyboardEvent) => void; open: boolean }) => React.ReactNode;
  /** Max results shown */
  limit?: number;
  className?: string;
}

const typeIcon: Record<MentionType, React.ReactNode> = { file: <FileText />, agent: <Bot />, person: <User /> };
const typeLabel: Record<MentionType, string> = { file: "Files", agent: "Agents", person: "People" };
const TRIGGER = /(^|\s)@([^\s@]*)$/;

export function MentionPicker({ value, onValueChange, items, onSelect, selected = [], children, limit = 8, className }: MentionPickerProps) {
  const m = TRIGGER.exec(value);
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const open = !!m && dismissed !== value;
  const q = (m?.[2] ?? "").toLowerCase();
  const results = React.useMemo(
    () => (open ? items.filter((i) => !selected.includes(i.id) && (i.label.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))).slice(0, limit) : []),
    [open, items, selected, q, limit]
  );
  const [active, setActive] = React.useState(0);
  React.useEffect(() => setActive(0), [q]);
  React.useEffect(() => { if (!m) setDismissed(null); }, [m]);

  const pick = (item: MentionItem) => { onValueChange(value.replace(/@[^\s@]*$/, "")); onSelect(item); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (results.length ? (a + 1) % results.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0)); }
    else if ((e.key === "Enter" || e.key === "Tab") && results[active] && !(e.nativeEvent as KeyboardEvent).isComposing) { e.preventDefault(); pick(results[active]); }
    else if (e.key === "Escape") { e.preventDefault(); setDismissed(value); }
  };

  let lastType: MentionType | undefined;
  return (
    <div className={cn("relative", className)}>
      {open && (
        <div role="listbox" aria-label="Mention" className="absolute bottom-full left-0 z-30 mb-2 max-h-64 w-full max-w-xs overflow-y-auto rounded-lg border border-border bg-bg p-1 shadow-lg" style={{ animation: "pl-in .12s ease-out" }} onMouseDown={(e) => e.preventDefault()}>
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-fg-subtle">No matches for “{q}”</p>
          ) : results.map((it, i) => {
            const header = it.type && it.type !== lastType ? typeLabel[it.type] : null;
            lastType = it.type;
            return (
              <React.Fragment key={it.id}>
                {header && <p className="px-2 pb-1 pt-2 text-xs font-medium text-fg-subtle">{header}</p>}
                <div role="option" aria-selected={i === active} onMouseMove={() => setActive(i)} onClick={() => pick(it)}
                  className={cn("flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5", i === active && "bg-surface-2")}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-sm bg-surface-2 text-fg-muted [&_svg]:size-3.5">{it.icon ?? (it.type ? typeIcon[it.type] : <AtSign />)}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-fg">{it.label}</span>
                  {it.description && <span className="max-w-[45%] shrink-0 truncate text-xs text-fg-subtle">{it.description}</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
      {children({ onKeyDown, open })}
    </div>
  );
}

/** A context chip for a mentioned item — place it in the input's attachments slot. */
export function MentionChip({ item, onRemove, className }: { item: MentionItem; onRemove?: () => void; className?: string }) {
  return (
    <span className={cn("inline-flex h-7 max-w-[14rem] items-center gap-1.5 rounded-md border border-border bg-surface pl-2 pr-1 text-sm text-fg", className)}>
      <span className="shrink-0 text-fg-muted [&_svg]:size-3.5">{item.icon ?? (item.type ? typeIcon[item.type] : <AtSign />)}</span>
      <span className="truncate">{item.label}</span>
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={`Remove ${item.label}`} className="grid size-5 shrink-0 place-items-center rounded-xs text-fg-subtle hover:bg-surface-2 hover:text-fg"><X className="size-3" /></button>
      ) : <span className="w-1" />}
    </span>
  );
}
