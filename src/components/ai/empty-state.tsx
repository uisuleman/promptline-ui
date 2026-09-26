import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * EmptyState
 * The first screen of a chat — never ship it blank.
 * Tell people what the product is for in one line, then give them one-click starters.
 */
export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Suggestions, SuggestionCards, or a PromptInput */
  children?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}

export function EmptyState({ title, description, icon, children, align = "center", className }: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex w-full max-w-2xl flex-col px-4", align === "center" ? "items-center text-center" : "items-start", className)} style={{ animation: "pl-in .3s ease-out" }}>
      {icon && <div className="mb-6 grid size-12 place-items-center rounded-xl border border-border bg-bg text-fg shadow-sm [&_svg]:size-5">{icon}</div>}
      <h2 className="text-3xl font-semibold text-fg">{title}</h2>
      {description && <p className="mt-2 text-lg text-fg-muted">{description}</p>}
      {children && <div className="mt-8 w-full">{children}</div>}
    </div>
  );
}
