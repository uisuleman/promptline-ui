"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { useFloating, useOutside, Portal, floatingPanel, type Side, type Align } from "../../lib/floating";
import { KbdGroup } from "./kbd";

/**
 * Shared menu engine for DropdownMenu and ContextMenu.
 * Data-driven items: action, checkbox, radio, label, separator, and one level of submenu.
 * Keyboard: ↑ ↓ Home End move · Enter/Space select · → opens submenu · ← / Esc closes · type to jump.
 */
export type MenuItem =
  | { type?: "item"; label: string; icon?: React.ReactNode; shortcut?: string[]; onSelect?: () => void; disabled?: boolean; danger?: boolean; description?: string }
  | { type: "checkbox"; label: string; checked: boolean; onCheckedChange: (v: boolean) => void; disabled?: boolean; hint?: string }
  | { type: "radio"; label: string; value: string; group: string; checked: boolean; onSelect: () => void }
  | { type: "label"; label: string }
  | { type: "separator" }
  | { type: "sub"; label: string; icon?: React.ReactNode; items: MenuItem[] };

const focusable = (it: MenuItem) => it.type !== "label" && it.type !== "separator" && !("disabled" in it && it.disabled);

export function MenuList({ items, onClose, className, style, floatingRef, level = 0 }: { items: MenuItem[]; onClose: () => void; className?: string; style?: React.CSSProperties; floatingRef?: (el: HTMLDivElement | null) => void; level?: number }) {
  const [active, setActive] = React.useState(-1);
  const [sub, setSub] = React.useState<number | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const buf = React.useRef({ s: "", t: 0 });
  const idxs = items.map((it, i) => (focusable(it) ? i : -1)).filter((i) => i >= 0);

  React.useEffect(() => { listRef.current?.focus(); }, []);
  React.useEffect(() => { if (active >= 0) (listRef.current?.querySelector(`[data-i="${active}"]`) as HTMLElement | null)?.focus(); }, [active]);

  const move = (d: 1 | -1) => {
    const pos = idxs.indexOf(active);
    setActive(idxs[(pos + d + idxs.length) % idxs.length] ?? idxs[0]);
  };
  const select = (i: number) => {
    const it = items[i];
    if (!it || !focusable(it)) return;
    if (it.type === "sub") { setSub(i); return; }
    if (it.type === "checkbox") { it.onCheckedChange(!it.checked); return; }
    if (it.type === "radio") { it.onSelect(); return; }
    if (it.type === undefined || it.type === "item") it.onSelect?.();
    onClose();
  };

  return (
    <div
      ref={(el) => { listRef.current = el; floatingRef?.(el); }}
      role="menu"
      tabIndex={-1}
      style={{ ...style, animation: "pl-pop .12s var(--ease-out)" }}
      className={cn(floatingPanel, "min-w-48 p-1 focus:outline-none", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
        else if (e.key === "Home") { e.preventDefault(); setActive(idxs[0]); }
        else if (e.key === "End") { e.preventDefault(); setActive(idxs[idxs.length - 1]); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(active); }
        else if (e.key === "ArrowRight" && items[active]?.type === "sub") { e.preventDefault(); setSub(active); }
        else if (e.key === "ArrowLeft" && level > 0) { e.preventDefault(); e.stopPropagation(); onClose(); }
        else if (e.key === "Tab") { e.preventDefault(); onClose(); }
        else if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          buf.current = { s: (now - buf.current.t < 500 ? buf.current.s : "") + e.key.toLowerCase(), t: now };
          const hit = idxs.find((i) => "label" in items[i] && (items[i] as { label: string }).label.toLowerCase().startsWith(buf.current.s));
          if (hit != null) setActive(hit);
        }
        if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      }}
    >
      {items.map((it, i) => {
        if (it.type === "separator") return <div key={i} role="separator" className="-mx-1 my-1 h-px bg-border" />;
        if (it.type === "label") return <div key={i} className="px-2 pb-1 pt-2 text-xs font-medium text-fg-subtle">{it.label}</div>;
        const disabled = "disabled" in it && it.disabled;
        const role = it.type === "checkbox" ? "menuitemcheckbox" : it.type === "radio" ? "menuitemradio" : "menuitem";
        const checked = it.type === "checkbox" || it.type === "radio" ? it.checked : undefined;
        return (
          <div key={i} className="relative">
            <div
              data-i={i}
              role={role}
              aria-checked={checked}
              aria-disabled={disabled || undefined}
              aria-haspopup={it.type === "sub" ? "menu" : undefined}
              aria-expanded={it.type === "sub" ? sub === i : undefined}
              tabIndex={-1}
              onMouseEnter={() => { setActive(i); if (it.type === "sub") setSub(i); else setSub(null); }}
              onClick={() => select(i)}
              className={cn(
                "flex h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 text-sm outline-none [&_svg]:size-4 [&_svg]:shrink-0",
                active === i ? "bg-surface-2 text-fg" : "text-fg",
                "danger" in it && it.danger && "text-danger",
                disabled && "pointer-events-none opacity-40",
                "description" in it && it.description && "h-auto py-1.5"
              )}
            >
              {(it.type === "checkbox" || it.type === "radio") ? (
                <span className="grid size-4 place-items-center">{it.checked && (it.type === "radio" ? <span className="size-1.5 rounded-full bg-current" /> : <Check className="!size-3.5" />)}</span>
              ) : "icon" in it && it.icon ? <span className={cn("text-fg-muted", "danger" in it && it.danger && "text-danger")}>{it.icon}</span> : null}
              <span className="flex-1">
                {it.label}
                {"description" in it && it.description && <span className="block text-xs text-fg-subtle">{it.description}</span>}
              </span>
              {"shortcut" in it && it.shortcut && <KbdGroup keys={it.shortcut} className="ml-4" />}
              {"hint" in it && it.hint && <span className="ml-4 text-xs tabular-nums text-fg-subtle">{it.hint}</span>}
              {it.type === "sub" && <ChevronRight className="text-fg-subtle" />}
            </div>
            {it.type === "sub" && sub === i && (
              <MenuList items={it.items} level={level + 1} onClose={() => { setSub(null); setActive(i); }} className="absolute left-full top-0 ml-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * DropdownMenu
 * Actions triggered from a button — row actions, account menus, "more" menus.
 */
export interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: MenuItem[];
  side?: Side;
  align?: Align;
  className?: string;
}

export function DropdownMenu({ trigger, items, side = "bottom", align = "start", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const fl = useFloating({ open, side, align, offset: 6 });
  const close = React.useCallback(() => { setOpen(false); (fl.anchor.current as HTMLElement | null)?.focus(); }, [fl.anchor]);
  useOutside(open, () => setOpen(false), [fl.anchor, fl.floating]);
  const t = React.cloneElement(trigger, {
    ref: (el: HTMLElement) => { fl.anchor.current = el; },
    onClick: () => setOpen((o) => !o),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); } },
    "aria-haspopup": "menu",
    "aria-expanded": open,
  } as any);
  return (
    <>
      {t}
      {open && <Portal><MenuList items={items} onClose={close} style={fl.style} floatingRef={(el) => { fl.floating.current = el; }} className={className} /></Portal>}
    </>
  );
}

/**
 * ContextMenu
 * Right-click (or long-press on touch) menu for an area — messages, files, canvas items.
 * Always mirror these actions somewhere visible; context menus are invisible to most users.
 */
export function ContextMenu({ items, children, className }: { items: MenuItem[]; children: React.ReactNode; className?: string }) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const menu = React.useRef<HTMLElement | null>(null);
  const press = React.useRef<number | undefined>(undefined);
  useOutside(!!pos, () => setPos(null), [menu]);
  const openAt = (x: number, y: number) => setPos({ x: Math.min(x, window.innerWidth - 220), y: Math.min(y, window.innerHeight - 40 - items.length * 32) });
  return (
    <div
      className={className}
      onContextMenu={(e) => { e.preventDefault(); openAt(e.clientX, e.clientY); }}
      onTouchStart={(e) => { const t = e.touches[0]; press.current = window.setTimeout(() => openAt(t.clientX, t.clientY), 550); }}
      onTouchEnd={() => window.clearTimeout(press.current)}
      onTouchMove={() => window.clearTimeout(press.current)}
    >
      {children}
      {pos && <Portal><MenuList items={items} onClose={() => setPos(null)} style={{ position: "fixed", top: pos.y, left: pos.x }} floatingRef={(el) => { menu.current = el; }} /></Portal>}
    </div>
  );
}
