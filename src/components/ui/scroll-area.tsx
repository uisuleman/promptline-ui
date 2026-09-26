"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * ScrollArea
 * Scroll container with thin themed scrollbars and edge fades that appear only when there's
 * more content in that direction — a quiet hint that the list continues.
 */
export function ScrollArea({ className, children, maxHeight, orientation = "vertical", fade = true, ...p }: React.HTMLAttributes<HTMLDivElement> & { maxHeight?: number | string; orientation?: "vertical" | "horizontal"; fade?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });
  const update = React.useCallback(() => {
    const el = ref.current; if (!el) return;
    const v = orientation === "vertical";
    const pos = v ? el.scrollTop : el.scrollLeft, size = v ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
    setEdges({ start: pos > 2, end: pos < size - 2 });
  }, [orientation]);
  React.useEffect(() => { update(); const ro = new ResizeObserver(update); if (ref.current) ro.observe(ref.current); return () => ro.disconnect(); }, [update]);
  const v = orientation === "vertical";
  const mask = fade ? `linear-gradient(${v ? "to bottom" : "to right"}, ${edges.start ? "transparent" : "#000"} 0, #000 24px, #000 calc(100% - 24px), ${edges.end ? "transparent" : "#000"} 100%)` : undefined;
  return (
    <div
      ref={ref}
      onScroll={update}
      tabIndex={0}
      className={cn(
        "relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20",
        v ? "overflow-y-auto overflow-x-hidden" : "overflow-x-auto overflow-y-hidden",
        "[scrollbar-color:rgb(var(--border-strong))_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:size-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong",
        className
      )}
      style={{ maxHeight, WebkitMaskImage: mask, maskImage: mask }}
      {...p}
    >
      {children}
    </div>
  );
}
