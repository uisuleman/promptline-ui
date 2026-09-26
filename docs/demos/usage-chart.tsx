import * as React from "react";
import { UsageChart } from "../../src";

const data = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  const weekend = [0, 6].includes(d.getDay());
  return { date: d, value: Math.round((weekend ? 18000 : 42000) + Math.sin(i * 1.7) * 9000 + i * 600) };
});

export function Default() {
  return <UsageChart className="w-full max-w-2xl" data={data} label="Tokens" limit={60000} />;
}

export function Cost() {
  const cost = data.map((p) => ({ date: p.date, value: p.value / 20000 }));
  return <UsageChart className="w-full max-w-2xl" data={cost} label="Spend" format={(v) => `$${v.toFixed(v < 10 ? 2 : 0)}`} ranges={[{ value: "14", label: "14 days", days: 14 }]} height={160} />;
}
