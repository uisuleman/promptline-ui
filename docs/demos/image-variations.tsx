import * as React from "react";
import { ImageVariations, Button } from "../../src";

const art = (a: string, b: string, c: string) => "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><circle cx='200' cy='220' r='90' fill='${c}' fill-opacity='.85'/><rect x='80' y='300' width='240' height='14' rx='7' fill='white' fill-opacity='.35'/></svg>`);
const imgs = [art("#fde68a", "#f97316", "#7c2d12"), art("#bfdbfe", "#6366f1", "#1e1b4b"), art("#bbf7d0", "#10b981", "#064e3b"), art("#fbcfe8", "#db2777", "#500724")];

export function Default() {
  const [sel, setSel] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="w-full max-w-sm space-y-3">
      <ImageVariations
        images={imgs.map((src, i) => ({ id: String(i), src, alt: "Minimal sunset poster, variation " + (i + 1) }))}
        selected={sel}
        onSelect={setSel}
        onVary={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}
        loading={loading}
      />
      <Button className="w-full" disabled={!sel}>Use selected image</Button>
    </div>
  );
}
