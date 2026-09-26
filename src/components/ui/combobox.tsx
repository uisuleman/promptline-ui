"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { useFloating, useOutside, Portal, floatingPanel } from "../../lib/floating";

/**
 * Combobox
 * Searchable select for long lists (models, users, tags). Single or multiple selection.
 * Multi mode shows selections as removable chips; `onCreate` lets users add a new option.
 * The input stays focused the whole time — arrows move, Enter picks, Backspace removes the last chip.
 */
export interface ComboboxOption { value: string; label: string; description?: string; icon?: React.ReactNode }

export interface ComboboxProps {
  options: ComboboxOption[];
  multiple?: boolean;
  value?: string | string[];
  onValueChange?: (value: any) => void;
  placeholder?: string;
  emptyText?: string;
  onCreate?: (label: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Combobox({ options, multiple, value, onValueChange, placeholder = "Search…", emptyText = "No results", onCreate, disabled, className, ...aria }: ComboboxProps) {
  const [inner, setInner] = React.useState<string | string[]>(multiple ? [] : "");
  const cur = value ?? inner;
  const selected = multiple ? (cur as string[]) : cur ? [cur as string] : [];
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const input = React.useRef<HTMLInputElement>(null);
  const fl = useFloating({ open, side: "bottom", align: "start", offset: 4, matchWidth: true });
  const listId = React.useId();
  useOutside(open, () => setOpen(false), [fl.anchor, fl.floating]);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const canCreate = onCreate && q.trim() && !options.some((o) => o.label.toLowerCase() === q.trim().toLowerCase());
  const total = filtered.length + (canCreate ? 1 : 0);
  const set = (v: string | string[]) => { setInner(v); onValueChange?.(v); };
  const toggle = (v: string) => {
    if (multiple) set(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    else { set(v); setOpen(false); }
    setQ("");
  };
  const choose = (i: number) => {
    if (i < filtered.length) toggle(filtered[i].value);
    else if (canCreate) { onCreate!(q.trim()); setQ(""); }
  };
  const label = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  return (
    <>
      <div
        ref={(el) => { fl.anchor.current = el; }}
        onClick={() => { input.current?.focus(); setOpen(true); }}
        className={cn(
          "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 rounded-md border border-border bg-bg py-1 pl-2 pr-1 shadow-xs transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:ring-4 focus-within:ring-fg/5",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        {multiple && selected.map((v) => (
          <span key={v} className="inline-flex h-6 items-center gap-1 rounded-sm bg-surface-2 pl-2 pr-1 text-sm text-fg">
            {label(v)}
            <button type="button" aria-label={`Remove ${label(v)}`} onClick={(e) => { e.stopPropagation(); toggle(v); }} className="grid size-4 place-items-center rounded-xs text-fg-subtle hover:bg-border hover:text-fg"><X className="size-3" /></button>
          </span>
        ))}
        <input
          ref={input}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && total ? `${listId}-${active}` : undefined}
          value={q}
          disabled={disabled}
          placeholder={selected.length && !multiple ? label(selected[0]) : multiple && selected.length ? "" : placeholder}
          onChange={(e) => { setQ(e.target.value); setActive(0); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, total - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); if (open) choose(active); }
            else if (e.key === "Escape") setOpen(false);
            else if (e.key === "Backspace" && !q && multiple && selected.length) toggle(selected[selected.length - 1]);
          }}
          className={cn("h-7 min-w-16 flex-1 bg-transparent px-1 text-base text-fg focus:outline-none", !multiple && selected.length ? "placeholder:text-fg" : "placeholder:text-fg-subtle")}
          {...aria}
        />
        <ChevronsUpDown className="mr-1 size-4 shrink-0 text-fg-subtle" aria-hidden />
      </div>
      {open && (
        <Portal>
          <ul id={listId} role="listbox" aria-multiselectable={multiple || undefined} ref={(el) => { fl.floating.current = el; }} style={{ ...fl.style, animation: "pl-pop .12s var(--ease-out)" }} className={cn(floatingPanel, "max-h-72 overflow-y-auto p-1")} onMouseDown={(e) => e.preventDefault()}>
            {filtered.map((o, i) => (
              <li key={o.value} id={`${listId}-${i}`} role="option" aria-selected={selected.includes(o.value)} onMouseEnter={() => setActive(i)} onClick={() => choose(i)}
                className={cn("flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm [&_svg]:size-4", i === active && "bg-surface-2")}>
                {multiple ? (
                  <span className={cn("grid size-4 shrink-0 place-items-center rounded-xs border", selected.includes(o.value) ? "border-accent bg-accent text-accent-fg" : "border-border-strong")}>{selected.includes(o.value) && <Check className="!size-3" strokeWidth={3} />}</span>
                ) : o.icon && <span className="text-fg-muted">{o.icon}</span>}
                <span className="min-w-0 flex-1"><span className="block truncate text-fg">{o.label}</span>{o.description && <span className="block truncate text-xs text-fg-subtle">{o.description}</span>}</span>
                {!multiple && selected.includes(o.value) && <Check className="text-fg" />}
              </li>
            ))}
            {canCreate && (
              <li id={`${listId}-${filtered.length}`} role="option" aria-selected={false} onMouseEnter={() => setActive(filtered.length)} onClick={() => choose(filtered.length)}
                className={cn("flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-fg-muted", active === filtered.length && "bg-surface-2 text-fg")}>
                <Plus className="size-4" />Create "{q.trim()}"
              </li>
            )}
            {!total && <li className="px-2 py-6 text-center text-sm text-fg-subtle">{emptyText}</li>}
          </ul>
        </Portal>
      )}
    </>
  );
}
