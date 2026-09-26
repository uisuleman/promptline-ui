"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Switch
 * On/off setting that applies immediately. If the change needs a Save button, use a Checkbox instead.
 */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Accessible label when there is no visible one */
  label?: string;
  id?: string;
  className?: string;
}

export function Switch({ checked, defaultChecked, onCheckedChange, disabled, size = "md", label, id, className }: SwitchProps) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const dims = size === "sm" ? { track: "h-4 w-7", thumb: "size-3", move: "translate-x-3" } : { track: "h-5 w-9", thumb: "size-4", move: "translate-x-4" };
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => { setInner(!on); onCheckedChange?.(!on); }}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50",
        dims.track,
        on ? "bg-accent" : "bg-border-strong",
        className
      )}
    >
      <span className={cn("rounded-full bg-bg shadow-sm transition-transform duration-200", dims.thumb, on && dims.move)} />
    </button>
  );
}
