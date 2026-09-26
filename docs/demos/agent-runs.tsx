import * as React from "react";
import { AgentRuns, type AgentRun, useToast } from "../../src";

const ago = (m: number) => new Date(Date.now() - m * 60000);

export function Default() {
  const toast = useToast();
  const [runs, setRuns] = React.useState<AgentRun[]>([
    { id: "1", title: "Research top 20 competitors' pricing", status: "running", startedAt: ago(3), progress: 62, step: "Reading pricing page 13 of 20", cost: 0.18 },
    { id: "2", title: "Translate help centre into Spanish", status: "queued", startedAt: ago(1) },
    { id: "3", title: "Summarise 142 support tickets", status: "completed", startedAt: ago(48), durationSec: 214, cost: 0.42 },
    { id: "4", title: "Sync CRM contacts to newsletter", status: "failed", startedAt: ago(120), durationSec: 12, cost: 0.01, error: "401 Unauthorized — reconnect HubSpot" },
    { id: "5", title: "Generate 30 product descriptions", status: "completed", startedAt: ago(60 * 26), durationSec: 96, cost: 0.12 },
  ]);
  return (
    <AgentRuns
      className="w-full max-w-2xl"
      runs={runs}
      onStop={(id) => setRuns((r) => r.map((x) => (x.id === id ? { ...x, status: "stopped", durationSec: 190 } : x)))}
      onRetry={(id) => setRuns((r) => r.map((x) => (x.id === id ? { ...x, status: "running", progress: 5, step: "Starting…", startedAt: new Date(), error: undefined } : x)))}
      onOpen={(id) => toast({ title: `Open run #${id}` })}
    />
  );
}
