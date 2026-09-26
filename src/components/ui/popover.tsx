"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { useFloating, useOutside, Portal, floatingPanel, type Side, type Align } from "../../lib/floating";

/**
 * Popover
 * Rich, interactive floating content anchored to a trigger (filters, settings, share panels).
 * Portalled so it's never clipped, flips when there's no room, closes on outside click / Esc,
 * and returns focus to the trigger.
 */
export interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  className?: string;
  /** Accessible name for the dialog */
  label?: string;
}

export function Popover({ trigger, children, open, defaultOpen, onOpenChange, side = "bottom", align = "start", className, label }: PopoverProps) {
  const [inner, setInner] = React.useState(!!defaultOpen);
  const isOpen = open ?? inner;
  const set = React.useCallback((v: boolean) => { setInner(v); onOpenChange?.(v); }, [onOpenChange]);
  const close = React.useCallback(() => { set(false); (fl.anchor.current as HTMLElement | null)?.focus?.(); }, [set]); // eslint-disable-line
  const fl = useFloating({ open: isOpen, side, align });
  const id = React.useId();
  useOutside(isOpen, () => set(false), [fl.anchor, fl.floating]);

  const t = React.cloneElement(trigger, {
    ref: (el: HTMLElement) => { fl.anchor.current = el; },
    onClick: (e: React.MouseEvent) => { (trigger.props as any).onClick?.(e); set(!isOpen); },
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog",
    "aria-controls": isOpen ? id : undefined,
  } as any);

  return (
    <>
      {t}
      {isOpen && (
        <Portal>
          <div
            id={id}
            ref={(el) => { fl.floating.current = el; }}
            role="dialog"
            aria-label={label}
            style={{ ...fl.style, animation: "pl-pop .14s var(--ease-out)" }}
            className={cn(floatingPanel, "w-72 p-4", className)}
            onKeyDown={(e) => { if (e.key === "Escape") close(); }}
          >
            {typeof children === "function" ? children(close) : children}
          </div>
        </Portal>
      )}
    </>
  );
}
