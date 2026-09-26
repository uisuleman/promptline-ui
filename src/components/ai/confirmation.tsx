import * as React from "react";
import { Check, ShieldAlert, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * Confirmation
 * Human-in-the-loop approval before an agent does something consequential
 * (sends email, spends money, deletes data, writes to production).
 * Rules: say exactly what will happen, show the target, make "Deny" as easy as "Approve".
 */
export type ConfirmationState = "pending" | "approved" | "denied";

export interface ConfirmationProps {
  title: string;
  description?: React.ReactNode;
  /** Key facts about the action — shown as a definition list */
  details?: { label: string; value: React.ReactNode }[];
  state?: ConfirmationState;
  risk?: "low" | "high";
  approveLabel?: string;
  denyLabel?: string;
  onApprove?: () => void;
  onDeny?: () => void;
  /** Optional "always allow" for this tool */
  onAlwaysAllow?: () => void;
  className?: string;
}

export function Confirmation({ title, description, details, state = "pending", risk = "low", approveLabel = "Approve", denyLabel = "Deny", onApprove, onDeny, onAlwaysAllow, className }: ConfirmationProps) {
  return (
    <div role="group" aria-label={title} className={cn("overflow-hidden rounded-lg border bg-bg text-sm", risk === "high" && state === "pending" ? "border-warning/40" : "border-border", className)}>
      <div className="flex gap-3 p-4">
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", risk === "high" ? "bg-warning/10 text-warning" : "bg-surface-2 text-fg-muted")}>
          <ShieldAlert className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-fg">{title}</p>
          {description && <p className="mt-1 text-fg-muted">{description}</p>}
          {details && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md bg-surface p-3 text-sm">
              {details.map((d) => (
                <React.Fragment key={d.label}>
                  <dt className="text-fg-subtle">{d.label}</dt>
                  <dd className="min-w-0 truncate text-fg">{d.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}
        </div>
      </div>
      <div className="flex min-h-12 items-center gap-2 border-t border-border bg-surface px-4 py-2">
        {state === "pending" ? (
          <>
            {onAlwaysAllow && <button type="button" onClick={onAlwaysAllow} className="mr-auto text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">Always allow</button>}
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" onClick={onDeny}>{denyLabel}</Button>
              <Button size="sm" onClick={onApprove}>{approveLabel}</Button>
            </div>
          </>
        ) : (
          <p className={cn("inline-flex items-center gap-2 text-sm font-medium", state === "approved" ? "text-success" : "text-fg-muted")} role="status">
            {state === "approved" ? <Check className="size-4" /> : <X className="size-4" />}
            {state === "approved" ? "Approved" : "Denied — the agent will not continue with this action"}
          </p>
        )}
      </div>
    </div>
  );
}
