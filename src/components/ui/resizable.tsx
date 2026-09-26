"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * ResizablePanels
 * Two or more panels with draggable handles between them — chat beside a canvas,
 * a file tree beside a preview. Sizes are percentages; min sizes are respected.
 * Handles are keyboard accessible (arrow keys ±5%, Home/End to min/max) and
 * double-click resets to the default layout.
 */
export interface ResizablePanelsProps {
  children: React.ReactNode[];
  direction?: "horizontal" | "vertical";
  /** Percent sizes, must add up to 100. Defaults to equal. */
  defaultSizes?: number[];
  /** Percent minimums per panel (default 15) */
  minSizes?: number[];
  onResize?: (sizes: number[]) => void;
  /** Accessible names for the panels, used by the handles */
  labels?: string[];
  className?: string;
}

export function ResizablePanels({ children, direction = "horizontal", defaultSizes, minSizes, onResize, labels, className }: ResizablePanelsProps) {
  const n = children.length;
  const initial = defaultSizes ?? Array(n).fill(100 / n);
  const [sizes, setSizes] = React.useState<number[]>(initial);
  const root = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState<number | null>(null);
  const horizontal = direction === "horizontal";
  const minOf = (i: number) => minSizes?.[i] ?? 15;

  const update = (next: number[]) => { setSizes(next); onResize?.(next); };

  /** Move the boundary after panel i by delta percent, clamped to both mins */
  const shift = (i: number, delta: number, base = sizes) => {
    const pair = base[i] + base[i + 1];
    const a = Math.min(Math.max(base[i] + delta, minOf(i)), pair - minOf(i + 1));
    const next = [...base]; next[i] = a; next[i + 1] = pair - a;
    update(next);
  };

  const onPointerDown = (i: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const rect = root.current!.getBoundingClientRect();
    const total = horizontal ? rect.width : rect.height;
    const start = horizontal ? e.clientX : e.clientY;
    const base = sizes;
    setDrag(i);
    const move = (ev: PointerEvent) => shift(i, (((horizontal ? ev.clientX : ev.clientY) - start) / total) * 100, base);
    const up = () => { setDrag(null); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div ref={root} className={cn("flex h-full w-full overflow-hidden", horizontal ? "flex-row" : "flex-col", drag !== null && (horizontal ? "cursor-col-resize select-none" : "cursor-row-resize select-none"), className)}>
      {children.map((child, i) => (
        <React.Fragment key={i}>
          <div className="min-h-0 min-w-0 overflow-auto" style={{ flexBasis: `${sizes[i]}%`, flexGrow: 0, flexShrink: 0 }}>{child}</div>
          {i < n - 1 && (
            <div
              role="separator"
              tabIndex={0}
              aria-orientation={horizontal ? "vertical" : "horizontal"}
              aria-valuenow={Math.round(sizes[i])}
              aria-valuemin={minOf(i)}
              aria-valuemax={Math.round(sizes[i] + sizes[i + 1] - minOf(i + 1))}
              aria-label={labels ? `Resize ${labels[i]}` : "Resize panels"}
              onPointerDown={onPointerDown(i)}
              onDoubleClick={() => update(initial)}
              onKeyDown={(e) => {
                const back = horizontal ? "ArrowLeft" : "ArrowUp", fwd = horizontal ? "ArrowRight" : "ArrowDown";
                if (e.key === back) { e.preventDefault(); shift(i, e.shiftKey ? -10 : -5); }
                else if (e.key === fwd) { e.preventDefault(); shift(i, e.shiftKey ? 10 : 5); }
                else if (e.key === "Home") { e.preventDefault(); shift(i, -100); }
                else if (e.key === "End") { e.preventDefault(); shift(i, 100); }
                else if (e.key === "Enter") { e.preventDefault(); update(initial); }
              }}
              className={cn("group relative z-10 flex shrink-0 touch-none items-center justify-center bg-border outline-none transition-colors hover:bg-fg/30 focus-visible:bg-fg/50",
                horizontal ? "w-px cursor-col-resize" : "h-px cursor-row-resize", drag === i && "bg-fg/50")}
            >
              {/* Larger invisible hit area */}
              <span aria-hidden className={cn("absolute", horizontal ? "inset-y-0 -left-1.5 -right-1.5" : "inset-x-0 -top-1.5 -bottom-1.5")} />
              <span aria-hidden className={cn("relative shrink-0 rounded-full border border-border bg-bg shadow-xs", horizontal ? "h-6 w-2.5" : "h-2.5 w-6")}>
                <span className={cn("absolute inset-0 m-auto rounded-full bg-fg-subtle", horizontal ? "h-3 w-px" : "h-px w-3")} />
              </span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
