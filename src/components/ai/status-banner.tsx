"use client";

import * as React from "react";
import { AlertTriangle, Clock, CreditCard, Info, ShieldOff, WifiOff, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * StatusBanner
 * Every failure an AI product can hit, each with a next step.
 * Copy rule: what happened → why (if useful) → what to do. Never "Something went wrong."
 * `countdown` (seconds) ticks down and enables the action at 0 — ideal for rate limits.
 */
export type StatusKind = "error" | "rate-limit" | "credits" | "offline" | "content-policy" | "info";

const presets: Record<StatusKind, { icon: React.ReactNode; tone: string; title: string; body: string; action: string }> = {
  error: { icon: <AlertTriangle />, tone: "danger", title: "The response didn't finish", body: "The connection dropped mid-answer. Your message is saved.", action: "Try again" },
  "rate-limit": { icon: <Clock />, tone: "warning", title: "Slow down a little", body: "You've sent a lot of messages in a short time.", action: "Retry" },
  credits: { icon: <CreditCard />, tone: "neutral", title: "You're out of credits", body: "Upgrade to keep going, or wait for your monthly reset.", action: "Upgrade" },
  offline: { icon: <WifiOff />, tone: "neutral", title: "You're offline", body: "We'll send your message when you reconnect.", action: "Retry now" },
  "content-policy": { icon: <ShieldOff />, tone: "neutral", title: "This request can't be completed", body: "Try rephrasing, or ask about something else.", action: "Edit message" },
  info: { icon: <Info />, tone: "info", title: "Heads up", body: "", action: "Got it" },
};
const tones: Record<string, string> = {
  danger: "border-danger/25 bg-danger/[0.04] [&_[data-icon]]:text-danger",
  warning: "border-warning/30 bg-warning/[0.05] [&_[data-icon]]:text-warning",
  info: "border-info/25 bg-info/[0.04] [&_[data-icon]]:text-info",
  neutral: "border-border bg-surface [&_[data-icon]]:text-fg-muted",
};

export interface StatusBannerProps {
  kind: StatusKind;
  title?: string;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  countdown?: number;
  className?: string;
}

export function StatusBanner({ kind, title, description, actionLabel, onAction, onDismiss, countdown, className }: StatusBannerProps) {
  const p = presets[kind];
  const [left, setLeft] = React.useState(countdown ?? 0);
  React.useEffect(() => { setLeft(countdown ?? 0); }, [countdown]);
  React.useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return (
    <div role={kind === "error" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg border p-4 text-sm", tones[p.tone], className)} style={{ animation: "pl-in .2s ease-out" }}>
      <span data-icon className="mt-0.5 shrink-0 [&_svg]:size-4">{p.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-fg">{title ?? p.title}</p>
        {(description ?? p.body) && <p className="mt-0.5 text-fg-muted">{description ?? p.body}</p>}
        {left > 0 && <p className="mt-1 text-xs tabular-nums text-fg-subtle">You can try again in {left}s</p>}
      </div>
      {onAction && (
        <Button size="sm" variant={kind === "credits" ? "primary" : "outline"} onClick={onAction} disabled={left > 0} className="shrink-0">
          {actionLabel ?? p.action}
        </Button>
      )}
      {onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss" className="-mr-1 grid size-8 shrink-0 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><X className="size-4" /></button>}
    </div>
  );
}
