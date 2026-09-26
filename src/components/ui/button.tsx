import * as React from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./spinner";

/**
 * Button
 * Five variants, four sizes + icon sizes. Heights: xs 28 · sm 32 · md 36 · lg 40.
 * `loading` keeps the width and swaps the icon for a spinner. `asChild`-style links: pass `href`.
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg shadow-xs hover:bg-accent/85",
  secondary: "bg-surface-2 text-fg hover:bg-border",
  outline: "border border-border bg-bg text-fg shadow-xs hover:bg-surface-2 hover:border-border-strong",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  danger: "bg-danger text-white shadow-xs hover:bg-danger/90",
  link: "h-auto px-0 text-fg underline-offset-4 hover:underline",
};
export const buttonSizes: Record<ButtonSize, string> = {
  xs: "h-7 gap-1 rounded-sm px-2 text-xs [&_svg]:size-3.5",
  sm: "h-8 gap-1.5 rounded-sm px-3 text-sm",
  md: "h-9 gap-2 rounded px-4 text-base",
  lg: "h-10 gap-2 rounded px-5 text-base",
  "icon-xs": "size-7 rounded-sm [&_svg]:size-3.5",
  "icon-sm": "size-8 rounded-sm",
  icon: "size-9 rounded",
  "icon-lg": "size-10 rounded",
};
export const buttonBase =
  "relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables the button, keeping its width */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", loading, disabled, children, ...props }, ref) => (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...props}>
      {loading ? (
        <>
          <span className="invisible inline-flex items-center gap-[inherit]">{children}</span>
          <span className="absolute inset-0 grid place-items-center"><Spinner /></span>
        </>
      ) : children}
    </button>
  )
);
Button.displayName = "Button";

/** Anchor styled as a button. */
export function ButtonLink({ variant = "primary", size = "md", className, ...p }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <a className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...p} />;
}

/**
 * ButtonGroup
 * Joins related buttons into one control. Children lose their inner corners and share borders.
 */
export function ButtonGroup({ className, orientation = "horizontal", ...p }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex isolate [&>*:focus-visible]:z-10",
        orientation === "horizontal"
          ? "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none"
          : "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
        className
      )}
      {...p}
    />
  );
}
