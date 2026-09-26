import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Card
 * Groups related content with a border. Compose: Card > CardHeader (title, description, action) > CardContent > CardFooter.
 * `interactive` adds hover and focus styles for clickable cards.
 */
export function Card({ className, interactive, ...p }: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return <div className={cn("rounded-xl border border-border bg-bg shadow-xs", interactive && "cursor-pointer transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-sm focus-within:ring-2 focus-within:ring-fg/20", className)} {...p} />;
}
export function CardHeader({ title, description, action, className, children }: { title?: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex items-start gap-4 p-5 pb-0", className)}>
      <div className="min-w-0 flex-1 space-y-1">
        {title && <h3 className="text-base font-semibold text-fg">{title}</h3>}
        {description && <p className="text-sm text-fg-muted">{description}</p>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
export function CardContent({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...p} />;
}
export function CardFooter({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2 border-t border-border px-5 py-3", className)} {...p} />;
}
