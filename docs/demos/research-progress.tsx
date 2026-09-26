import * as React from "react";
import { ResearchProgress, type ResearchPhase, type ResearchSource } from "../../src";

const PLAN = ["Plan the research", "Search the web", "Read and compare sources", "Write the report"];
const SITES = ["https://www.gartner.com/pricing-trends", "https://openviewpartners.com/usage-based-pricing", "https://www.lennysnewsletter.com/p/pricing", "https://stripe.com/guides/saas-pricing", "https://a16z.com/ai-pricing", "https://www.paddle.com/resources/value-metric", "https://news.ycombinator.com/item?id=4012", "https://www.reforge.com/blog/pricing", "https://www.priceintelligently.com/blog", "https://www.bvp.com/atlas/pricing", "https://www.saastr.com/pricing-ai", "https://blog.hubspot.com/pricing-pages"];

export function Default() {
  const [t, setT] = React.useState(0);
  const [stopped, setStopped] = React.useState(false);
  const total = 26;
  React.useEffect(() => {
    if (stopped || t >= total) return;
    const id = setTimeout(() => setT((x) => x + 1), 700);
    return () => clearTimeout(id);
  }, [t, stopped]);
  const phaseAt = t < 2 ? 0 : t < 8 ? 1 : t < 22 ? 2 : t < total ? 3 : 4;
  const phases: ResearchPhase[] = PLAN.map((label, i) => ({
    id: String(i), label, status: i < phaseAt ? "done" : i === phaseAt && !stopped ? "active" : "pending",
    detail: i === 1 ? "12 searches" : i === 2 ? "Comparing seat vs usage pricing" : undefined,
  }));
  const n = Math.max(0, Math.min(SITES.length, t - 2));
  const sources: ResearchSource[] = SITES.slice(0, n).map((url, i) => ({ url, status: i === n - 1 && phaseAt < 3 && !stopped ? "reading" : "read" }));
  const state = stopped ? "stopped" : t >= total ? "done" : "running";
  return (
    <div className="w-full max-w-2xl space-y-2">
      <ResearchProgress query="How are AI products pricing in 2026 — seats, usage or outcomes?" phases={phases} sources={sources} state={state} elapsed={t * 9.3} onStop={() => setStopped(true)} onOpenReport={() => {}} />
      {state !== "running" && <button type="button" onClick={() => { setT(0); setStopped(false); }} className="text-xs text-fg-subtle underline underline-offset-4">Restart</button>}
    </div>
  );
}
