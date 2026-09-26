"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { inputBase } from "./input";

/**
 * Textarea
 * Multi-line input. `autoResize` grows with content up to `maxRows`. `showCount` with maxLength shows a counter.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxRows?: number;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, autoResize, maxRows = 12, showCount, maxLength, onChange, value, defaultValue, rows = 3, ...p }, ref) => {
  const inner = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => inner.current!);
  const [count, setCount] = React.useState(String(value ?? defaultValue ?? "").length);
  const resize = () => {
    const el = inner.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, maxRows * 20 + 18) + "px";
  };
  React.useLayoutEffect(resize, [value, autoResize, maxRows]);
  return (
    <div className="relative w-full">
      <textarea
        ref={inner}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(e) => { setCount(e.target.value.length); resize(); onChange?.(e); }}
        className={cn(inputBase, "block min-h-16 resize-y py-2", autoResize && "resize-none", showCount && "pb-6", className)}
        {...p}
      />
      {showCount && maxLength && (
        <span className={cn("pointer-events-none absolute bottom-2 right-3 text-xs tabular-nums", count >= maxLength ? "text-danger" : "text-fg-subtle")}>{count}/{maxLength}</span>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";
