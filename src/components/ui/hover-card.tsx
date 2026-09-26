import * as React from "react";
import { cn } from "../../lib/cn";
import { useFloating, Portal, floatingPanel, type Side, type Align } from "../../lib/floating";

/**
 * HoverCard
 * Preview on hover or focus — user profiles, link previews, source previews.
 * Opens after a short delay so moving the mouse across the page doesn't flash cards,
 * and stays open while the pointer is over the card itself.
 */
export interface HoverCardProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  side?: Side;
  align?: Align;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

export function HoverCard({ trigger, children, side = "bottom", align = "start", openDelay = 400, closeDelay = 150, className }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const t = React.useRef<number | undefined>(undefined);
  const fl = useFloating({ open, side, align });
  const show = () => { window.clearTimeout(t.current); t.current = window.setTimeout(() => setOpen(true), openDelay); };
  const hide = () => { window.clearTimeout(t.current); t.current = window.setTimeout(() => setOpen(false), closeDelay); };
  React.useEffect(() => () => window.clearTimeout(t.current), []);

  const el = React.cloneElement(trigger, {
    ref: (n: HTMLElement) => { fl.anchor.current = n; },
    onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide,
  } as any);

  return (
    <>
      {el}
      {open && (
        <Portal>
          <div ref={(n) => { fl.floating.current = n; }} onMouseEnter={show} onMouseLeave={hide} style={{ ...fl.style, animation: "pl-pop .14s var(--ease-out)" }} className={cn(floatingPanel, "w-72 p-4", className)}>
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
