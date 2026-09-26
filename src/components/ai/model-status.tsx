import * as React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * ModelStatus
 * Honest service health for the models your product depends on.
 * - <StatusDot/> inline next to a model name (e.g. in the ModelSelector)
 * - <ModelStatusList/> for a status popover or page: current state + 30-day uptime bars
 * When a provider is degraded, say what users will notice ("slower responses"), not just "degraded".
 */
export type Health = "operational" | "degraded" | "outage" | "maintenance";

const meta: Record<Health, { label: string; dot: string; text: string; Icon: typeof CheckCircle2 }> = {
  operational: { label: "Operational", dot: "bg-success", text: "text-success", Icon: CheckCircle2 },
  degraded: { label: "Degraded", dot: "bg-warning", text: "text-warning", Icon: AlertTriangle },
  outage: { label: "Outage", dot: "bg-danger", text: "text-danger", Icon: XCircle },
  maintenance: { label: "Maintenance", dot: "bg-info", text: "text-info", Icon: AlertTriangle },
};

export function StatusDot({ health, showLabel, className }: { health: Health; showLabel?: boolean; className?: string }) {
  const m = meta[health];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)} title={m.label}>
      <span className="relative flex size-2">
        {health !== "operational" && <span className={cn("absolute inset-0 rounded-full opacity-60", m.dot)} style={{ animation: "pl-pulse 1.6s infinite" }} />}
        <span className={cn("relative size-2 rounded-full", m.dot)} />
      </span>
      {showLabel ? <span className={m.text}>{m.label}</span> : <span className="sr-only">{m.label}</span>}
    </span>
  );
}

export interface ServiceStatus { name: string; health: Health; note?: string; /** 30 values, oldest first */ history?: Health[]; uptime?: number }

export function ModelStatusList({ services, updatedAt, className }: { services: ServiceStatus[]; updatedAt?: string; className?: string }) {
  const worst = services.some((s) => s.health === "outage") ? "outage" : services.some((s) => s.health === "degraded") ? "degraded" : services.some((s) => s.health === "maintenance") ? "maintenance" : "operational";
  const W = meta[worst];
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm", className)}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <W.Icon className={cn("size-4", W.text)} />
        <p className="flex-1 font-medium text-fg">{worst === "operational" ? "All systems operational" : worst === "outage" ? "Some models are unavailable" : worst === "degraded" ? "Some models are slower than usual" : "Scheduled maintenance"}</p>
        {updatedAt && <span className="text-xs text-fg-subtle">{updatedAt}</span>}
      </div>
      <ul className="divide-y divide-border">
        {services.map((s) => (
          <li key={s.name} className="space-y-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex-1 font-medium text-fg">{s.name}</span>
              {s.uptime != null && <span className="text-xs tabular-nums text-fg-subtle">{s.uptime.toFixed(2)}% uptime</span>}
              <StatusDot health={s.health} showLabel />
            </div>
            {s.note && <p className="text-xs text-fg-muted">{s.note}</p>}
            {s.history && (
              <div className="flex h-6 gap-[2px]" aria-label={`${s.name}: last ${s.history.length} days`}>
                {s.history.map((h, i) => <span key={i} title={meta[h].label} className={cn("flex-1 rounded-[2px]", h === "operational" ? "bg-success/70" : meta[h].dot)} />)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
