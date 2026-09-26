import * as React from "react";
import { JsonViewer } from "../../src";

const result = {
  id: "run_8f2k1",
  status: "completed",
  model: "swift-pro",
  usage: { input_tokens: 1843, output_tokens: 412, cost_usd: 0.0124 },
  cached: false,
  output: {
    company: "Acme Robotics",
    founded: 2019,
    customers: [
      { name: "Northwind", plan: "Enterprise", seats: 240 },
      { name: "Globex", plan: "Team", seats: 18 },
    ],
    tags: ["hardware", "b2b", "series-b"],
    website: null,
  },
};

export function Default() {
  return <JsonViewer className="max-w-xl" label="extract_company · result" data={result} />;
}

export function Collapsed() {
  return <JsonViewer className="max-w-xl" label="response.json" data={result} defaultExpandDepth={1} />;
}
