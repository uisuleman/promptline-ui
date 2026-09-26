import * as React from "react";
import { GenerateButton, type GenerateState } from "../../src";

export function Default() {
  const [state, setState] = React.useState<GenerateState>("idle");
  const [text, setText] = React.useState("");
  const timer = React.useRef<number | undefined>(undefined);
  const generate = () => {
    setState("generating");
    timer.current = window.setTimeout(() => {
      setText("Handmade ceramic mug with a speckled glaze. Holds 350 ml, dishwasher safe, and feels great in the hand.");
      setState("done");
      window.setTimeout(() => setState("idle"), 1500);
    }, 1600);
  };
  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="desc" className="text-sm font-medium text-fg">Product description</label>
        <GenerateButton size="sm" state={state} onGenerate={generate} onCancel={() => { clearTimeout(timer.current); setState("idle"); }} label="Write with AI" />
      </div>
      <textarea id="desc" value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Describe your product…" className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-base text-fg shadow-xs placeholder:text-fg-subtle focus:border-border-strong focus:outline-none" />
    </div>
  );
}

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <GenerateButton state="idle" variant="primary" onGenerate={() => {}} />
      <GenerateButton state="idle" variant="outline" onGenerate={() => {}} />
      <GenerateButton state="idle" variant="ghost" onGenerate={() => {}} />
      <GenerateButton state="generating" onGenerate={() => {}} onCancel={() => {}} />
      <GenerateButton state="done" onGenerate={() => {}} />
    </div>
  );
}
