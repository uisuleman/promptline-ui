import * as React from "react";
import { Slider } from "../../src";

export function Default() {
  const [t, setT] = React.useState(0.7);
  return <div className="w-full max-w-sm"><Slider label="Temperature" showValue min={0} max={2} step={0.1} value={t} onValueChange={setT} format={(v) => v.toFixed(1)} marks={["Precise", "Balanced", "Creative"]} /></div>;
}

export function Range() {
  const [r, setR] = React.useState<[number, number]>([20, 80]);
  return <div className="w-full max-w-sm"><Slider label="Price range" showValue value={r} onValueChange={setR} format={(v) => `$${v}`} /></div>;
}

export function MaxTokens() {
  return <div className="w-full max-w-sm"><Slider label="Max output tokens" showValue defaultValue={2048} min={256} max={8192} step={256} format={(v) => v.toLocaleString()} /></div>;
}
