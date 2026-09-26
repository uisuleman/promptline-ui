import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Sheet
 * A panel that slides in from an edge — settings, filters, artifact panels, mobile navigation.
 * `side="bottom"` becomes a drawer with a grab handle on phones.
 * Focus is trapped while open and returned to the trigger on close.
 */
export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "right" | "left" | "bottom";
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Hide the built-in close button (when the content has its own) */
  showClose?: boolean;
  className?: string;
}

export function Sheet({ open, onOpenChange, side = "right", title, description, footer, children, showClose = true, className }: SheetProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const change = React.useRef(onOpenChange);
  change.current = onOpenChange;
  const [render, setRender] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (open) { setRender(true); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); }
    else { setShown(false); const t = setTimeout(() => setRender(false), 220); return () => clearTimeout(t); }
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>("input, textarea, select, button:not([data-close])")?.focus() ?? ref.current?.focus(), 30);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") change.current(false);
      if (e.key === "Tab" && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])"));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener("keydown", key);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.removeEventListener("keydown", key); document.body.style.overflow = o; prev?.focus?.(); };
  }, [open]);

  if (!render) return null;
  const pos = {
    right: cn("inset-y-0 right-0 h-full w-full max-w-md border-l", shown ? "translate-x-0" : "translate-x-full"),
    left: cn("inset-y-0 left-0 h-full w-full max-w-md border-r", shown ? "translate-x-0" : "-translate-x-full"),
    bottom: cn("inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-xl border-t", shown ? "translate-y-0" : "translate-y-full"),
  }[side];

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className={cn("absolute inset-0 bg-black/40 transition-opacity duration-200", shown ? "opacity-100" : "opacity-0")} onClick={() => onOpenChange(false)} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" tabIndex={-1} className={cn("absolute flex flex-col border-border bg-bg shadow-lg outline-none transition-transform duration-200 ease-out", pos, className)}>
        {side === "bottom" && <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border-strong" aria-hidden />}
        {(title || description) && (
          <div className="shrink-0 space-y-1 p-6 pb-4 pr-14">
            {title && <h2 className="text-xl font-semibold text-fg">{title}</h2>}
            {description && <p className="text-base text-fg-muted">{description}</p>}
          </div>
        )}
        {showClose && <button type="button" data-close onClick={() => onOpenChange(false)} aria-label="Close" className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><X className="size-4" /></button>}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
        {footer && <div className="flex shrink-0 justify-end gap-2 border-t border-border bg-surface px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
