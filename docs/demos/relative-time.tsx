import * as React from "react";
import { RelativeTime, dayGroup } from "../../src";

export function Default() {
  const now = Date.now();
  const dates = [10e3, 5 * 60e3, 3 * 3600e3, 26 * 3600e3, 4 * 86400e3, 40 * 86400e3].map((ms) => new Date(now - ms));
  return (
    <ul className="w-full max-w-sm divide-y divide-border rounded-lg border border-border text-sm">
      {dates.map((d) => (
        <li key={d.getTime()} className="flex items-center justify-between px-4 py-2.5">
          <RelativeTime date={d} className="text-fg" />
          <span className="text-xs text-fg-subtle">{dayGroup(d)}</span>
        </li>
      ))}
    </ul>
  );
}
