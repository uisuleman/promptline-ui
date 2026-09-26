import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Toggle & ToggleGroup
 * Pressed/unpressed buttons for formatting, view modes and filters.
 * ToggleGroup type="single" behaves like a segmented control; "multiple" like a set of switches.
 */
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: "sm" | "md";
  variant?: "ghost" | "outline";
}

const toggleCls = (on: boolean, size: "sm" | "md", variant: "ghost" | "outline") =>
  cn(
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
    size === "sm" ? "h-8 min-w-8 px-2 text-sm" : "h-9 min-w-9 px-2.5 text-base",
    variant === "outline" && "border border-border shadow-xs",
    on ? "bg-surface-2 text-fg" : "text-fg-muted hover:bg-surface-2/60 hover:text-fg"
  );

export function Toggle({ pressed, defaultPressed, onPressedChange, size = "md", variant = "ghost", className, ...p }: ToggleProps) {
  const [inner, setInner] = React.useState(!!defaultPressed);
  const on = pressed ?? inner;
  return <button type="button" aria-pressed={on} onClick={() => { setInner(!on); onPressedChange?.(!on); }} className={cn(toggleCls(on, size, variant), className)} {...p} />;
}

export interface ToggleGroupItem { value: string; label: React.ReactNode; "aria-label"?: string; disabled?: boolean }

export function ToggleGroup({ type = "single", items, value, defaultValue, onValueChange, size = "md", variant = "outline", className }: {
  type?: "single" | "multiple";
  items: ToggleGroupItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (v: any) => void;
  size?: "sm" | "md";
  variant?: "ghost" | "outline" | "segmented";
  className?: string;
}) {
  const [inner, setInner] = React.useState<string | string[]>(defaultValue ?? (type === "single" ? "" : []));
  const cur = value ?? inner;
  const isOn = (v: string) => (Array.isArray(cur) ? cur.includes(v) : cur === v);
  const set = (v: string) => {
    const next = type === "single" ? v : Array.isArray(cur) && cur.includes(v) ? cur.filter((x) => x !== v) : [...(cur as string[]), v];
    setInner(next); onValueChange?.(next);
  };
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const seg = variant === "segmented";
  return (
    <div
      role={type === "single" ? "radiogroup" : "group"}
      className={cn("inline-flex items-center", seg ? "gap-0.5 rounded-md bg-surface-2 p-0.5" : variant === "outline" ? "rounded-md border border-border p-0.5 shadow-xs" : "gap-1", className)}
      onKeyDown={(e) => {
        const i = refs.current.findIndex((r) => r === document.activeElement);
        if (i < 0) return;
        if (e.key === "ArrowRight") { e.preventDefault(); refs.current[(i + 1) % items.length]?.focus(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); refs.current[(i - 1 + items.length) % items.length]?.focus(); }
      }}
    >
      {items.map((it, i) => {
        const on = isOn(it.value);
        return (
          <button
            key={it.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role={type === "single" ? "radio" : undefined}
            aria-checked={type === "single" ? on : undefined}
            aria-pressed={type === "multiple" ? on : undefined}
            aria-label={it["aria-label"]}
            disabled={it.disabled}
            onClick={() => set(it.value)}
            className={cn(toggleCls(on, size, "ghost"), seg && on && "bg-bg text-fg shadow-xs", seg && !on && "hover:bg-transparent")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
