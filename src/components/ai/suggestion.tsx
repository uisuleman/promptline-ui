import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Suggestion
 * Starter prompts and follow-ups. Horizontal scroll on small screens so they never wrap into a wall.
 * Use 3–4 max. Write them as things the user would actually type.
 */
export function Suggestions({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("-mx-1 flex min-w-0 max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)} role="list" {...p}>
      {children}
    </div>
  );
}

export interface SuggestionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  suggestion: string;
  onPick: (suggestion: string) => void;
  icon?: React.ReactNode;
}

export function Suggestion({ suggestion, onPick, icon, className, children, ...p }: SuggestionProps) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={() => onPick(suggestion)}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-3 text-sm text-fg-muted transition-colors",
        "hover:border-border-strong hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 [&_svg]:size-4",
        className
      )}
      {...p}
    >
      {icon}
      {children ?? suggestion}
    </button>
  );
}

/** Card-style grid for empty states — two columns, title + description. */
export function SuggestionCard({ title, description, icon, onPick, className }: { title: string; description?: string; icon?: React.ReactNode; onPick: (s: string) => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => onPick(description ? `${title} ${description}` : title)}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-bg p-4 text-left transition-colors hover:border-border-strong hover:bg-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20",
        className
      )}
    >
      {icon && <span className="mt-0.5 text-fg-muted [&_svg]:size-4">{icon}</span>}
      <span className="min-w-0">
        <span className="block text-base font-medium text-fg">{title}</span>
        {description && <span className="mt-0.5 block text-sm text-fg-muted">{description}</span>}
      </span>
    </button>
  );
}
