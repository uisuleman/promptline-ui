import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Table
 * Styled semantic table primitives. Use for static data; use DataTable for sorting,
 * filtering, selection and pagination. Numbers should be right-aligned with tabular figures.
 */
export function Table({ className, wrapperClassName, ...p }: React.TableHTMLAttributes<HTMLTableElement> & { wrapperClassName?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-border", wrapperClassName)}>
      <table className={cn("w-full caption-bottom border-collapse text-left text-sm", className)} {...p} />
    </div>
  );
}
export function THead({ className, ...p }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-surface text-xs text-fg-muted [&_tr]:border-b [&_tr]:border-border", className)} {...p} />;
}
export function TBody({ className, ...p }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...p} />;
}
export function TR({ className, selected, ...p }: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return <tr data-selected={selected || undefined} className={cn("border-b border-border transition-colors hover:bg-surface/60 data-[selected]:bg-surface-2/60", className)} {...p} />;
}
export function TH({ className, align = "left", ...p }: React.ThHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" | "center" }) {
  return <th className={cn("h-10 whitespace-nowrap px-4 font-medium", align === "right" && "text-right", align === "center" && "text-center", className)} {...p} />;
}
export function TD({ className, align = "left", ...p }: React.TdHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" | "center" }) {
  return <td className={cn("h-12 whitespace-nowrap px-4 text-fg", align === "right" && "text-right tabular-nums", align === "center" && "text-center", className)} {...p} />;
}
export function TCaption({ className, ...p }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("py-3 text-xs text-fg-subtle", className)} {...p} />;
}
