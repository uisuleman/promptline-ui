import * as React from "react";

/**
 * RelativeTime
 * "just now", "5m ago", "Yesterday", "Mar 4" — updates itself, shows the full date on hover,
 * and renders a semantic <time> element. `dayGroup()` returns the history-list label for a date.
 */
const rtf = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat(undefined, { numeric: "auto", style: "short" }) : null;

export function formatRelative(date: Date, now = new Date()): string {
  const s = Math.round((now.getTime() - date.getTime()) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return rtf ? rtf.format(-m, "minute") : `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return rtf ? rtf.format(-h, "hour") : `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return rtf ? rtf.format(-d, "day") : `${d}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }) });
}

export function dayGroup(date: Date, now = new Date()): string {
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(date)) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return "Previous 7 days";
  if (diff < 30) return "Previous 30 days";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function RelativeTime({ date, className }: { date: Date | string | number; className?: string }) {
  const d = React.useMemo(() => new Date(date), [date]);
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const age = Date.now() - d.getTime();
    const every = age < 3600_000 ? 30_000 : 600_000;
    const t = setInterval(() => tick((x) => x + 1), every);
    return () => clearInterval(t);
  }, [d]);
  return (
    <time dateTime={d.toISOString()} title={d.toLocaleString()} className={className}>
      {formatRelative(d)}
    </time>
  );
}
