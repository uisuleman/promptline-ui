/* Shared sample data for the docs demos. Not part of the library. */
import * as React from "react";
import { Zap, Brain as BrainIcon, Sparkles } from "lucide-react";

export const models = [
  { id: "swift", name: "Swift", provider: "Acme", description: "Fast answers for everyday tasks", badges: ["Fast"], icon: <Zap /> },
  { id: "swift-pro", name: "Swift Pro", provider: "Acme", description: "Deeper reasoning for complex work", badges: ["Reasoning"], icon: <BrainIcon /> },
  { id: "nova", name: "Nova", provider: "Acme", description: "Our most capable model", badges: ["New"], locked: true, icon: <Sparkles /> },
];

export const manyModels = [
  ...models,
  { id: "o-mini", name: "Orbit Mini", provider: "Orbit Labs", description: "Low-cost, high-volume" },
  { id: "o-large", name: "Orbit Large", provider: "Orbit Labs", description: "Long context · 1M tokens", badges: ["1M"] },
  { id: "o-vision", name: "Orbit Vision", provider: "Orbit Labs", description: "Images and documents", badges: ["Vision"] },
  { id: "local", name: "Local 8B", provider: "Self-hosted", description: "Runs on your machine" },
];

export const sources = [
  { title: "Designing for streaming AI responses", url: "https://www.nngroup.com/articles/ai-streaming", description: "Show progress early; perceived speed matters more than raw latency." },
  { title: "Skeleton screens vs. spinners", url: "https://web.dev/articles/loading-states", description: "When a layout is known, placeholders beat spinners." },
  { title: "ARIA live regions", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions", description: "Announce dynamic content changes to screen readers." },
  { title: "Human–AI interaction guidelines", url: "https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction", description: "18 guidelines for designing AI experiences." },
];

/** Generated-art placeholder (inline SVG, no network). */
export const sampleImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><radialGradient id='a' cx='30%' cy='30%' r='80%'><stop offset='0' stop-color='#f5d0fe'/><stop offset='.5' stop-color='#a5b4fc'/><stop offset='1' stop-color='#0f172a'/></radialGradient><radialGradient id='b' cx='75%' cy='70%' r='50%'><stop offset='0' stop-color='#fde68a' stop-opacity='.9'/><stop offset='1' stop-color='#fde68a' stop-opacity='0'/></radialGradient></defs><rect width='400' height='400' fill='url(#a)'/><rect width='400' height='400' fill='url(#b)'/><circle cx='200' cy='210' r='90' fill='none' stroke='white' stroke-opacity='.5' stroke-width='1'/><circle cx='200' cy='210' r='60' fill='white' fill-opacity='.15'/></svg>`);

export const imageThumb =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='#e0e7ff'/><circle cx='22' cy='22' r='8' fill='#fbbf24'/><path d='M0 50l18-18 14 14 10-10 22 22H0z' fill='#6366f1'/></svg>`);

export function useStream(text: string, speed = 30) {
  const [out, setOut] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const t = React.useRef<number | undefined>(undefined);
  const start = React.useCallback(() => {
    window.clearInterval(t.current);
    const words = text.split(" ");
    let i = 0;
    setOut(""); setRunning(true);
    t.current = window.setInterval(() => {
      i++;
      setOut(words.slice(0, i).join(" "));
      if (i >= words.length) { window.clearInterval(t.current); setRunning(false); }
    }, speed);
  }, [text, speed]);
  const stop = React.useCallback(() => { window.clearInterval(t.current); setRunning(false); }, []);
  React.useEffect(() => () => window.clearInterval(t.current), []);
  return { out, running, start, stop };
}
