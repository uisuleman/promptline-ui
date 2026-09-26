import * as React from "react";
import { ModelStatusList, StatusDot, type Health } from "../../src";

const hist = (bad: number[] = [], deg: number[] = []): Health[] => Array.from({ length: 30 }, (_, i) => (bad.includes(i) ? "outage" : deg.includes(i) ? "degraded" : "operational"));

export function Default() {
  return (
    <ModelStatusList
      className="w-full max-w-lg"
      updatedAt="Updated 1 min ago"
      services={[
        { name: "Swift", health: "operational", uptime: 99.98, history: hist([], [12]) },
        { name: "Swift Pro", health: "degraded", note: "Responses are slower than usual (about 2×). No action needed.", uptime: 99.71, history: hist([4], [28, 29]) },
        { name: "Image generation", health: "operational", uptime: 99.9, history: hist([], [7, 8]) },
      ]}
    />
  );
}

export function InlineDots() {
  return (
    <div className="flex flex-col gap-3 text-sm text-fg">
      <span className="flex items-center gap-2">Swift <StatusDot health="operational" /></span>
      <span className="flex items-center gap-2">Swift Pro <StatusDot health="degraded" showLabel /></span>
      <span className="flex items-center gap-2">Nova <StatusDot health="outage" showLabel /></span>
      <span className="flex items-center gap-2">Search <StatusDot health="maintenance" showLabel /></span>
    </div>
  );
}
