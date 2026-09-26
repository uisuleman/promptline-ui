import * as React from "react";
import { Plan, type PlanStep } from "../../src";

const initial: PlanStep[] = [
  { title: "Audit the current onboarding flow", detail: "5 screens, drop-off data from last 30 days" },
  { title: "Identify the 3 biggest friction points" },
  { title: "Draft improved copy for each screen" },
  { title: "Create a before/after summary" },
];

export function Default() {
  const [steps, setSteps] = React.useState(initial);
  const run = () => {
    initial.forEach((_, i) => {
      setTimeout(() => setSteps((s) => s.map((x, j) => ({ ...x, status: j < i ? "done" : j === i ? "doing" : "todo" }))), i * 1200);
    });
    setTimeout(() => setSteps((s) => s.map((x) => ({ ...x, status: "done" }))), initial.length * 1200);
  };
  return (
    <Plan
      className="w-full max-w-lg"
      title="Improve onboarding conversion"
      summary="I'll review the flow, find where people drop off, and rewrite the copy."
      steps={steps}
      onRun={run}
      onEdit={() => {}}
    />
  );
}
