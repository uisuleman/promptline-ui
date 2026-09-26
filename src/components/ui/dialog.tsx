import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Accessible modal primitive: portal, focus trap, Esc + backdrop close, focus restore.
 * Compose with DialogHeader / DialogTitle / DialogDescription / DialogBody / DialogFooter.
 */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  label?: string;
  className?: string;
  /** "center" for dialogs, "top" for command palettes */
  position?: "center" | "top";
  showClose?: boolean;
  /** Close when the backdrop is clicked (default true) */
  dismissOnBackdrop?: boolean;
}

export function Dialog({ open, onClose, children, labelledBy, label, className, position = "center", showClose = true, dismissOnBackdrop = true }: DialogProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? []);
    (ref.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); closeRef.current(); }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; prev?.focus?.(); };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className={cn("fixed inset-0 z-[100] flex justify-center p-4", position === "center" ? "items-center" : "items-start pt-[12vh]")}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] dark:bg-black/60" onClick={dismissOnBackdrop ? onClose : undefined} aria-hidden style={{ animation: "pl-in .15s ease-out" }} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        className={cn("relative w-full max-w-lg rounded-xl border border-border bg-bg shadow-lg", className)}
        style={{ animation: "pl-pop .18s var(--ease-out)" }}
      >
        {showClose && (
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid size-8 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg">
            <X className="size-4" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ---------- Layout helpers ---------- */
export function DialogHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1 p-6 pb-0 pr-12", className)} {...p} />;
}
export function DialogTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-semibold text-fg", className)} {...p} />;
}
export function DialogDescription({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-base text-fg-muted", className)} {...p} />;
}
export function DialogBody({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...p} />;
}
export function DialogFooter({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse gap-2 border-t border-border bg-surface px-6 py-4 sm:flex-row sm:justify-end rounded-b-xl", className)} {...p} />;
}
