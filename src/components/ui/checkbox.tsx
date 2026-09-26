"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Checkbox
 * Native input underneath (forms, keyboard and screen readers just work) with a custom box.
 * Supports `indeterminate` for "select all" rows. Pass `label` / `description` for a full row.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ checked, defaultChecked, onCheckedChange, indeterminate, label, description, className, disabled, id, ...p }, ref) => {
  const inner = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inner.current!);
  React.useEffect(() => { if (inner.current) inner.current.indeterminate = !!indeterminate; }, [indeterminate]);
  const auto = React.useId();
  const cid = id ?? auto;
  const box = (
    <span className="relative inline-grid size-4 shrink-0 place-items-center">
      <input
        ref={inner}
        id={cid}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="peer absolute inset-0 cursor-pointer appearance-none rounded-xs border border-border-strong bg-bg shadow-xs transition-colors checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger"
        {...p}
      />
      <Check className="pointer-events-none relative size-3 text-accent-fg opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0" strokeWidth={3} />
      <Minus className="pointer-events-none absolute size-3 text-accent-fg opacity-0 peer-indeterminate:opacity-100" strokeWidth={3} />
    </span>
  );
  if (!label) return <span className={className}>{box}</span>;
  return (
    <label htmlFor={cid} className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60", className)}>
      <span className="mt-0.5">{box}</span>
      <span className="space-y-0.5">
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description && <span className="block text-xs text-fg-muted">{description}</span>}
      </span>
    </label>
  );
});
Checkbox.displayName = "Checkbox";
