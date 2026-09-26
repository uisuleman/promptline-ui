import * as React from "react";
import { AlertTriangle, Check, MoreHorizontal, RefreshCw } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { DropdownMenu } from "../ui/menu";

/**
 * Connectors
 * Tiles for connecting the apps your AI reads from. Every state has its own look and
 * exactly one obvious next action: Connect → Connecting… → Connected (manage) / Syncing / Error (reconnect).
 */
export type ConnectorStatus = "disconnected" | "connecting" | "connected" | "syncing" | "error";

export interface ConnectorCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ConnectorStatus;
  /** Signed-in account, e.g. "maya@acme.com" */
  account?: string;
  /** e.g. "Synced 5 min ago" / "Syncing 128 of 412 files" */
  detail?: string;
  error?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  onSettings?: () => void;
  className?: string;
}

export function ConnectorCard({ name, description, icon, status, account, detail, error, onConnect, onDisconnect, onSync, onSettings, className }: ConnectorCardProps) {
  const live = status === "connected" || status === "syncing";
  return (
    <div className={cn("flex flex-col rounded-xl border bg-bg p-4 transition-colors", status === "error" ? "border-danger/30" : "border-border", className)}>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-fg [&_svg]:size-5">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-fg">
            <span className="truncate">{name}</span>
            {live && <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-success"><Check className="size-3" strokeWidth={3} />Connected</span>}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm text-fg-muted">{description}</p>
        </div>
        {live && (onDisconnect || onSettings || onSync) && (
          <DropdownMenu align="end" trigger={<button type="button" aria-label={`${name} options`} className="grid size-8 shrink-0 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><MoreHorizontal className="size-4" /></button>}
            items={[
              ...(onSync ? [{ label: "Sync now", icon: <RefreshCw />, onSelect: onSync }] : []),
              ...(onSettings ? [{ label: "Settings", onSelect: onSettings }] : []),
              ...(onDisconnect ? [{ type: "separator" as const }, { label: "Disconnect", danger: true, onSelect: onDisconnect }] : []),
            ]} />
        )}
      </div>

      <div className="mt-4 flex min-h-8 items-center gap-2">
        {status === "disconnected" && <Button size="sm" variant="outline" onClick={onConnect}>Connect</Button>}
        {status === "connecting" && <Button size="sm" variant="outline" disabled><Spinner className="size-3.5" />Waiting for {name}…</Button>}
        {status === "connected" && <p className="min-w-0 truncate text-xs text-fg-subtle">{[account, detail].filter(Boolean).join(" · ")}</p>}
        {status === "syncing" && <p className="flex min-w-0 items-center gap-2 text-xs text-fg-muted"><Spinner className="size-3 shrink-0" /><span className="truncate">{detail ?? "Syncing…"}</span></p>}
        {status === "error" && (
          <>
            <p className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-danger"><AlertTriangle className="size-3.5 shrink-0" /><span className="truncate">{error ?? "Connection lost"}</span></p>
            <Button size="sm" variant="outline" onClick={onConnect} className="shrink-0">Reconnect</Button>
          </>
        )}
      </div>
    </div>
  );
}

export function ConnectorGrid({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid w-full gap-3 sm:grid-cols-2", className)} {...p} />;
}
