import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Tabs
 * Switch between views of the same thing. Three styles: underline (page sections),
 * segmented (compact toggles like Preview / Code) and pills.
 * Arrow keys move between tabs (automatic activation), Home/End jump to ends.
 */
export interface TabItem { value: string; label: React.ReactNode; icon?: React.ReactNode; badge?: React.ReactNode; disabled?: boolean; content?: React.ReactNode }

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  variant?: "underline" | "segmented" | "pills";
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
  /** Rendered at the right end of the tab list */
  actions?: React.ReactNode;
}

export function Tabs({ items, value, defaultValue, onValueChange, variant = "underline", size = "md", fullWidth, className, actions }: TabsProps) {
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.value);
  const cur = value ?? inner;
  const id = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
  const select = (i: number) => { const t = items[i]; setInner(t.value); onValueChange?.(t.value); refs.current[i]?.focus(); };
  const active = items.find((t) => t.value === cur);

  const list = {
    underline: "gap-6 border-b border-border",
    segmented: "gap-0.5 rounded-md bg-surface-2 p-0.5",
    pills: "gap-1",
  }[variant];
  const tab = (on: boolean) => ({
    underline: cn("-mb-px border-b-2 px-0.5", size === "sm" ? "h-9" : "h-10", on ? "border-fg text-fg" : "border-transparent text-fg-muted hover:text-fg"),
    segmented: cn("rounded-sm px-3", size === "sm" ? "h-7" : "h-8", on ? "bg-bg text-fg shadow-xs" : "text-fg-muted hover:text-fg"),
    pills: cn("rounded-full px-3", size === "sm" ? "h-7" : "h-8", on ? "bg-fg text-bg" : "text-fg-muted hover:bg-surface-2 hover:text-fg"),
  }[variant]);

  return (
    <div className={className}>
      <div className={cn("flex items-center", variant === "underline" && "border-b border-border")}>
        <div
          role="tablist"
          className={cn("flex min-w-0 items-center overflow-x-auto [scrollbar-width:none]", list, variant === "underline" && "border-b-0", fullWidth && "w-full [&>*]:flex-1")}
          onKeyDown={(e) => {
            const i = items.findIndex((t) => t.value === cur);
            const p = enabled.indexOf(i);
            if (e.key === "ArrowRight") { e.preventDefault(); select(enabled[(p + 1) % enabled.length]); }
            if (e.key === "ArrowLeft") { e.preventDefault(); select(enabled[(p - 1 + enabled.length) % enabled.length]); }
            if (e.key === "Home") { e.preventDefault(); select(enabled[0]); }
            if (e.key === "End") { e.preventDefault(); select(enabled[enabled.length - 1]); }
          }}
        >
          {items.map((t, i) => {
            const on = t.value === cur;
            return (
              <button
                key={t.value}
                ref={(el) => { refs.current[i] = el; }}
                id={`${id}-t-${t.value}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={t.content !== undefined ? `${id}-p-${t.value}` : undefined}
                tabIndex={on ? 0 : -1}
                disabled={t.disabled}
                onClick={() => select(i)}
                className={cn("inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 disabled:opacity-40 [&_svg]:size-4", size === "sm" ? "text-sm" : "text-sm", tab(on))}
              >
                {t.icon}{t.label}{t.badge}
              </button>
            );
          })}
        </div>
        {actions && <div className="ml-auto flex items-center gap-1 pl-4">{actions}</div>}
      </div>
      {active?.content !== undefined && (
        <div key={active.value} id={`${id}-p-${active.value}`} role="tabpanel" aria-labelledby={`${id}-t-${active.value}`} tabIndex={0} className="pt-4 focus-visible:outline-none" style={{ animation: "pl-in .15s ease-out" }}>
          {active.content}
        </div>
      )}
    </div>
  );
}
