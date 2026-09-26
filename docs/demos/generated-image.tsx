import * as React from "react";
import { GeneratedImage, Button } from "../../src";
import { sampleImage } from "./_data";

export function Default() {
  const [status, setStatus] = React.useState<"generating" | "done">("done");
  const [progress, setProgress] = React.useState(0);
  const regenerate = () => {
    setStatus("generating"); setProgress(0);
    let p = 0;
    const t = setInterval(() => { p += 12; setProgress(Math.min(p, 100)); if (p >= 100) { clearInterval(t); setStatus("done"); } }, 250);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <GeneratedImage className="w-72" src={sampleImage} alt="A soft glowing orb over a violet gradient, minimal" status={status} progress={progress} />
      <Button variant="outline" size="sm" onClick={regenerate} disabled={status === "generating"}>Regenerate</Button>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
      <GeneratedImage alt="Isometric illustration of a tiny cozy workspace" status="generating" progress={45} />
      <GeneratedImage alt="Portrait of a robot barista" status="error" onRetry={() => {}} />
    </div>
  );
}
