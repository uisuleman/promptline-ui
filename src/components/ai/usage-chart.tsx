import * as React from "react";
import { cn } from "../../lib/cn";
import { Tabs } from "../ui/tabs";

/**
 * UsageChart
 * Daily tokens, messages or cost for billing and admin pages.
 * One series, one hue (the accent), bars anchored to a zero baseline with 2px gaps and 4px rounded tops;
 * days over the limit turn amber,
 * a dashed daily-limit line, hover tooltip per bar, headline total, and an accessible table.
 */
export interface UsagePoint { date: Date; value: number }

export interface UsageChartProps {
  data: UsagePoint[];
  label?: string;
  unit?: string;
  format?: (v: number) => string;
  /** Daily limit — drawn as a dashed reference line */
  limit?: number;
  ranges?: { value: string; label: string; days: number }[];
  height?: number;
  className?: string;
}

const compact = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}K` : String(Math.round(v)));
const niceMax = (v: number) => { const p = Math.pow(10, Math.floor(Math.log10(v || 1))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; };

export function UsageChart({ data, label = "Tokens", unit = "", format = compact, limit, ranges = [{ value: "7", label: "7 days", days: 7 }, { value: "30", label: "30 days", days: 30 }], height = 200, className }: UsageChartProps) {
  const [range, setRange] = React.useState(ranges[ranges.length - 1]?.value ?? "30");
  const [hover, setHover] = React.useState<number | null>(null);
  const days = ranges.find((r) => r.value === range)?.days ?? data.length;
  const pts = data.slice(-days);
  const total = pts.reduce((s, p) => s + p.value, 0);
  const max = niceMax(Math.max(...pts.map((p) => p.value), limit ?? 0));
  const ticks = [0, max / 2, max];
  const d = (x: Date) => x.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className={cn("rounded-lg border border-border bg-bg p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-fg-muted">{label} · last {days} days</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-fg">{format(total)}{unit && <span className="ml-1 text-base font-normal text-fg-muted">{unit}</span>}</p>
          {limit != null && (
            <p className="mt-2 flex items-center gap-3 text-xs text-fg-muted">
              <span className="inline-flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-fg-muted" />Daily limit {format(limit)}</span>
              {pts.some((p) => p.value > limit) && <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-[2px] bg-warning" />Over limit</span>}
            </p>
          )}
        </div>
        {ranges.length > 1 && <Tabs variant="segmented" size="sm" value={range} onValueChange={setRange} items={ranges.map((r) => ({ value: r.value, label: r.label }))} />}
      </div>

      <div className="relative mt-6 flex gap-2" style={{ height }}>
        <div className="flex w-9 shrink-0 flex-col-reverse justify-between pb-6 text-right text-2xs tabular-nums text-fg-subtle" aria-hidden>
          {ticks.map((t) => <span key={t} className="-mb-2 leading-4">{format(t)}</span>)}
        </div>
        <div className="relative min-w-0 flex-1 pb-6">
          <div className="absolute inset-x-0 top-0 bottom-6">
            {ticks.map((t) => <div key={t} className="absolute inset-x-0 border-t border-border" style={{ bottom: `${(t / max) * 100}%` }} aria-hidden />)}
            {limit != null && (
              <div className="absolute inset-x-0 border-t border-dashed border-fg-muted" style={{ bottom: `${(limit / max) * 100}%` }} aria-hidden />
            )}
            <div className="absolute inset-0 flex items-end gap-[2px]" role="img" aria-label={`${label} per day, total ${format(total)}`}>
              {pts.map((p, i) => {
                const over = limit != null && p.value > limit;
                return (
                  <div key={i} className="flex h-full min-w-0 flex-1 items-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                    <div
                      className={cn("w-full rounded-t-[4px] transition-opacity", over ? "bg-warning" : "bg-accent", hover != null && hover !== i && "opacity-40")}
                      style={{ height: `${Math.max((p.value / max) * 100, p.value ? 1 : 0)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            {hover != null && pts[hover] && (
              <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs shadow-md" style={{ left: `${((hover + 0.5) / pts.length) * 100}%`, bottom: `${(pts[hover].value / max) * 100}%`, marginBottom: 8 }}>
                <p className="text-fg-muted">{d(pts[hover].date)}</p>
                <p className="font-medium tabular-nums text-fg">{format(pts[hover].value)} {unit}</p>
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-2xs text-fg-subtle" aria-hidden>
            <span>{pts[0] && d(pts[0].date)}</span><span>{pts[pts.length - 1] && d(pts[pts.length - 1].date)}</span>
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>{label} per day</caption>
        <thead><tr><th>Date</th><th>{label}</th></tr></thead>
        <tbody>{pts.map((p, i) => <tr key={i}><td>{d(p.date)}</td><td>{format(p.value)}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
