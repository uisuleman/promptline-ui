import * as React from "react";
import { VoiceMode, VoiceOrb, Button, type VoiceModeState } from "../../src";
import { AudioLines } from "lucide-react";

const script: [VoiceModeState, number, string][] = [
  ["connecting", 1200, ""],
  ["listening", 3200, "What's a good name for a meal-planning app?"],
  ["thinking", 1600, ""],
  ["speaking", 4200, "How about “Pantry” — short, friendly, and it hints at what you already have at home."],
];

export function Default() {
  const [active, setActive] = React.useState(true);
  const [step, setStep] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [captions, setCaptions] = React.useState(true);
  const [level, setLevel] = React.useState(0);
  const [state, dur, text] = script[step];
  React.useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % script.length || 1), dur);
    return () => clearTimeout(t);
  }, [step, active, dur]);
  React.useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const loop = (t: number) => { const x = (t - t0) / 1000; setLevel(Math.abs(Math.sin(x * 7) * 0.6 + Math.sin(x * 13) * 0.4)); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!active) return <Button onClick={() => { setStep(0); setActive(true); }}><AudioLines />Start voice chat</Button>;
  const words = text.split(" ");
  const caption = state === "listening" || state === "speaking" ? words.slice(0, Math.max(1, Math.round(words.length * 0.8))).join(" ") : "";
  return (
    <VoiceMode className="max-w-md" state={state} level={level} muted={muted} onMutedChange={setMuted} onEnd={() => setActive(false)}
      caption={caption} captions={captions} onCaptionsChange={setCaptions} />
  );
}

export function OrbStates() {
  const [level, setLevel] = React.useState(0.4);
  React.useEffect(() => { const t = setInterval(() => setLevel(Math.random()), 120); return () => clearInterval(t); }, []);
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
      {(["connecting", "listening", "thinking", "speaking"] as VoiceModeState[]).map((s) => (
        <div key={s} className="flex flex-col items-center gap-3"><VoiceOrb state={s} level={level} size={88} /><span className="text-xs capitalize text-fg-muted">{s}</span></div>
      ))}
    </div>
  );
}
