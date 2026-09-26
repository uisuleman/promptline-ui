import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Input & InputGroup
 * 36px text field with focus ring, invalid state and sizes.
 * InputGroup adds leading/trailing addons (icons, text, buttons) inside the same border.
 */
export const inputBase =
  "w-full min-w-0 rounded-md border border-border bg-bg px-3 text-base text-fg shadow-xs transition-[border-color,box-shadow] " +
  "placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-4 focus:ring-fg/5 " +
  "disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger/60 aria-[invalid=true]:focus:ring-danger/10 " +
  "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, size = "md", ...p }, ref) => (
  <input ref={ref} className={cn(inputBase, size === "sm" ? "h-8 text-sm" : size === "lg" ? "h-10" : "h-9", className)} {...p} />
));
Input.displayName = "Input";

export interface InputGroupProps extends InputProps {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Wrapper class */
  groupClassName?: string;
}

export const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(({ leading, trailing, groupClassName, className, size = "md", ...p }, ref) => (
  <div
    className={cn(
      "flex w-full items-center gap-2 rounded-md border border-border bg-bg px-3 text-fg-subtle shadow-xs transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:ring-4 focus-within:ring-fg/5 has-[input:disabled]:opacity-50 has-[[aria-invalid=true]]:border-danger/60 [&_svg]:size-4 [&_svg]:shrink-0",
      size === "sm" ? "h-8" : size === "lg" ? "h-10" : "h-9",
      groupClassName
    )}
  >
    {leading && <span className="flex shrink-0 items-center text-sm">{leading}</span>}
    <input ref={ref} className={cn("h-full min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-fg-subtle focus:outline-none", size === "sm" && "text-sm", className)} {...p} />
    {trailing && <span className="-mr-1 flex shrink-0 items-center text-sm">{trailing}</span>}
  </div>
));
InputGroup.displayName = "InputGroup";
