"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { useFloating, useOutside, Portal, floatingPanel } from "../../lib/floating";

/**
 * Select
 * Pick one option from a list of up to ~15. For longer lists or free text, use Combobox.
 * Options can have descriptions, icons and groups. Keyboard: ↑ ↓ Home End, type-ahead, Enter, Esc.
 */
export interface SelectOption { value: string; label: string; description?: string; icon?: React.ReactNode; group?: string; disabled?: boolean }

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  className?: string;
}

export function Select({ options, value, defaultValue, onValueChange, placeholder = "Select…", disabled, size = "md", id, className, ...aria }: SelectProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const current = value ?? inner;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const fl = useFloating({ open, side: "bottom", align: "start", offset: 4, matchWidth: true });
  const listId = React.useId();
  const buf = React.useRef({ s: "", t: 0 });
  useOutside(open, () => setOpen(false), [fl.anchor, fl.floating]);
  const sel = options.find((o) => o.value === current);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const openList = () => { setActive(Math.max(0, options.findIndex((o) => o.value === current))); setOpen(true); };
  const pick = (i: number) => { const o = options[i]; if (!o || o.disabled) return; setInner(o.value); onValueChange?.(o.value); setOpen(false); (fl.anchor.current as HTMLElement)?.focus(); };
  const move = (d: number) => { const p = enabled.indexOf(active); setActive(enabled[Math.max(0, Math.min(enabled.length - 1, p + d))]); };
  React.useEffect(() => { if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active, open, listId]);

  let lastGroup: string | undefined;
  return (
    <>
      <button
        id={id}
        ref={(el) => { fl.anchor.current = el; }}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openList(); return; }
          if (!open) return;
          if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
          else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
          else if (e.key === "Home") { e.preventDefault(); setActive(enabled[0]); }
          else if (e.key === "End") { e.preventDefault(); setActive(enabled[enabled.length - 1]); }
          else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(active); }
          else if (e.key === "Tab") setOpen(false);
          else if (e.key.length === 1) {
            const now = Date.now();
            buf.current = { s: (now - buf.current.t < 500 ? buf.current.s : "") + e.key.toLowerCase(), t: now };
            const hit = enabled.find((i) => options[i].label.toLowerCase().startsWith(buf.current.s));
            if (hit != null) setActive(hit);
          }
        }}
        className={cn(
          "flex w-full min-w-0 items-center gap-2 rounded-md border border-border bg-bg px-3 text-left text-base shadow-xs transition-[border-color,box-shadow] focus-visible:border-border-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fg/5 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger/60 [&_svg]:size-4 [&_svg]:shrink-0",
          size === "sm" ? "h-8 text-sm" : "h-9",
          className
        )}
        {...aria}
      >
        {sel?.icon && <span className="text-fg-muted">{sel.icon}</span>}
        <span className={cn("flex-1 truncate", !sel && "text-fg-subtle")}>{sel?.label ?? placeholder}</span>
        <ChevronsUpDown className="text-fg-subtle" />
      </button>
      {open && (
        <Portal>
          <ul
            id={listId}
            role="listbox"
            ref={(el) => { fl.floating.current = el; }}
            style={{ ...fl.style, animation: "pl-pop .12s var(--ease-out)" }}
            className={cn(floatingPanel, "max-h-72 overflow-y-auto p-1")}
          >
            {options.map((o, i) => {
              const header = o.group && o.group !== lastGroup;
              lastGroup = o.group;
              return (
                <React.Fragment key={o.value}>
                  {header && <li role="presentation" className="px-2 pb-1 pt-2 text-xs font-medium text-fg-subtle">{o.group}</li>}
                  <li
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={o.value === current}
                    aria-disabled={o.disabled || undefined}
                    onMouseEnter={() => !o.disabled && setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(i)}
                    className={cn("flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm [&_svg]:size-4", i === active && "bg-surface-2", o.disabled && "opacity-40")}
                  >
                    {o.icon && <span className="text-fg-muted">{o.icon}</span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-fg">{o.label}</span>
                      {o.description && <span className="block truncate text-xs text-fg-subtle">{o.description}</span>}
                    </span>
                    {o.value === current && <Check className="text-fg" />}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </Portal>
      )}
    </>
  );
}
