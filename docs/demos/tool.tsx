import * as React from "react";
import { Globe, CloudSun, Database } from "lucide-react";
import { Tool } from "../../src";

export function Default() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <Tool name="web_search" title="Searched the web" icon={<Globe />} state="completed" duration="1.2s" input={{ query: "best AI chat UX patterns", limit: 5 }} output={{ results: 5, top: "nngroup.com/articles/ai-streaming" }} />
      <Tool name="get_weather" title="Checking the weather" icon={<CloudSun />} state="running" input={{ city: "Lisbon" }} />
      <Tool name="run_sql" title="Query failed" icon={<Database />} state="error" duration="0.4s" input={{ sql: "SELECT * FROM orders WHERE created_at > now() - interval '7 days'" }} errorText={'relation "orders" does not exist'} />
    </div>
  );
}

export function CustomResult() {
  return (
    <Tool name="get_weather" title="Weather in Lisbon" icon={<CloudSun />} state="completed" defaultOpen className="w-full max-w-2xl">
      <div className="flex items-center gap-4 rounded-md border border-border bg-bg p-4">
        <CloudSun className="size-10 text-fg-muted" />
        <div>
          <p className="text-3xl font-semibold text-fg">24°</p>
          <p className="text-sm text-fg-muted">Partly cloudy · H 26° L 17°</p>
        </div>
      </div>
    </Tool>
  );
}

export function AllStates() {
  const states = ["pending", "running", "awaiting-approval", "completed", "error", "denied"] as const;
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      {states.map((s) => <Tool key={s} name="send_email" title={`state="${s}"`} state={s} />)}
    </div>
  );
}
