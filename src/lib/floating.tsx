import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Tiny positioning engine for popovers, menus, selects and hover cards.
 * - Renders content in a portal with `position: fixed`, so it never gets clipped by overflow
 * - Flips to the other side when there isn't room, clamps inside the viewport
 * - Re-positions on scroll and resize
 */
export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export function useFloating({ open, side = "bottom", align = "start", offset = 8, matchWidth = false }: { open: boolean; side?: Side; align?: Align; offset?: number; matchWidth?: boolean }) {
  const anchor = React.useRef<HTMLElement | null>(null);
  const floating = React.useRef<HTMLElement | null>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({ position: "fixed", top: -9999, left: -9999 });
  const [placed, setPlaced] = React.useState<Side>(side);

  const update = React.useCallback(() => {
    const a = anchor.current?.getBoundingClientRect();
    const f = floating.current;
    if (!a || !f) return;
    const fw = f.offsetWidth, fh = f.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, m = 8;
    let s = side;
    if (s === "bottom" && a.bottom + offset + fh > vh - m && a.top - offset - fh > m) s = "top";
    else if (s === "top" && a.top - offset - fh < m && a.bottom + offset + fh < vh - m) s = "bottom";
    else if (s === "right" && a.right + offset + fw > vw - m) s = "left";
    else if (s === "left" && a.left - offset - fw < m) s = "right";
    let top = 0, left = 0;
    if (s === "bottom" || s === "top") {
      top = s === "bottom" ? a.bottom + offset : a.top - offset - fh;
      left = align === "start" ? a.left : align === "end" ? a.right - fw : a.left + a.width / 2 - fw / 2;
    } else {
      left = s === "right" ? a.right + offset : a.left - offset - fw;
      top = align === "start" ? a.top : align === "end" ? a.bottom - fh : a.top + a.height / 2 - fh / 2;
    }
    left = Math.max(m, Math.min(left, vw - fw - m));
    top = Math.max(m, Math.min(top, vh - fh - m));
    setPlaced(s);
    setStyle({ position: "fixed", top, left, ...(matchWidth ? { minWidth: a.width } : null) });
  }, [side, align, offset, matchWidth]);

  React.useLayoutEffect(() => {
    if (!open) return;
    update();
    const raf = requestAnimationFrame(update);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (floating.current) ro?.observe(floating.current);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [open, update]);

  return { anchor, floating, style, side: placed, update };
}

/** Close when clicking outside both the anchor and the floating element, or on Escape. */
export function useOutside(open: boolean, onClose: () => void, refs: React.RefObject<HTMLElement | null>[]) {
  React.useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!refs.some((r) => r.current?.contains(e.target as Node))) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);
}

/** Floating content only renders after user interaction, so it is safe to portal immediately. */
export function Portal({ children }: { children: React.ReactNode }) {
  return typeof document === "undefined" ? null : createPortal(children, document.body);
}

/** Shared surface for every floating panel. */
export const floatingPanel = "z-[120] rounded-lg border border-border bg-bg text-fg shadow-lg outline-none";
