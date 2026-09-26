import * as React from "react";
import { AudioPlayer } from "../../src";

/** Builds a short WAV in the browser so the demo plays without a network file. */
function useToneWav(seconds = 12) {
  return React.useMemo(() => {
    const rate = 16000, n = rate * seconds;
    const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
    const notes = [262, 330, 392, 523, 392, 330];
    for (let i = 0; i < n; i++) {
      const t = i / rate, f = notes[Math.floor(t * 2) % notes.length], env = Math.min(1, (t * 2) % 1 * 8) * Math.exp(-((t * 2) % 1) * 3);
      v.setInt16(44 + i * 2, Math.sin(2 * Math.PI * f * t) * env * 0.25 * 32767, true);
    }
    return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  }, [seconds]);
}

export function Default() {
  const src = useToneWav();
  return <AudioPlayer className="max-w-lg" src={src} title="Weekly summary — narrated" downloadable downloadName="weekly-summary.wav" />;
}

export function InMessage() {
  const src = useToneWav(8);
  return (
    <div className="w-full max-w-md space-y-2">
      <p className="text-sm text-fg">Here's your briefing as audio — 8 seconds.</p>
      <AudioPlayer src={src} title="Morning briefing" rates={[1, 1.5, 2]} />
    </div>
  );
}
