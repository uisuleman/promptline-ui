import * as React from "react";
import { Progress, ProgressRing } from "../../src";

export function Default() {
  const [v, setV] = React.useState(35);
  React.useEffect(() => { const t = setInterval(() => setV((x) => (x >= 100 ? 0 : x + 5)), 400); return () => clearInterval(t); }, []);
  return (
    <div className="w-full max-w-sm space-y-6">
      <Progress label="Indexing documents" value={v} showValue />
      <Progress label="Syncing" />
      <Progress value={92} size="sm" tone="warning" />
    </div>
  );
}

export function Ring() {
  return <div className="flex items-center gap-6"><ProgressRing value={25} /><ProgressRing value={68} size={56} /><ProgressRing value={100} size={32} stroke={3} showValue={false} /></div>;
}
