import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Alert
 * Inline, persistent message inside a page or form. For AI-specific failures
 * (rate limits, credits, offline) use StatusBanner, which ships the copy and actions.
 */
export type AlertTone = "info" | "success" | "warning" | "danger" | "neutral";

export interface AlertProps {
  tone?: AlertTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode | false;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const tones: Record<AlertTone, { cls: string; Icon: typeof Info }> = {
  info: { cls: "border-info/25 bg-info/[0.04] [&_[data-ic]]:text-info", Icon: Info },
  success: { cls: "border-success/25 bg-success/[0.04] [&_[data-ic]]:text-success", Icon: CheckCircle2 },
  warning: { cls: "border-warning/30 bg-warning/[0.05] [&_[data-ic]]:text-warning", Icon: AlertTriangle },
  danger: { cls: "border-danger/25 bg-danger/[0.04] [&_[data-ic]]:text-danger", Icon: XCircle },
  neutral: { cls: "border-border bg-surface [&_[data-ic]]:text-fg-muted", Icon: Info },
};

export function Alert({ tone = "neutral", title, children, icon, action, onDismiss, className }: AlertProps) {
  const t = tones[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg border p-4 text-sm", t.cls, className)}>
      {icon !== false && <span data-ic className="mt-0.5 shrink-0 [&_svg]:size-4">{icon ?? <t.Icon />}</span>}
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium text-fg">{title}</p>}
        {children && <div className={cn("text-fg-muted", title && "mt-0.5")}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss" className="-m-1 grid size-7 shrink-0 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><X className="size-4" /></button>}
    </div>
  );
}
