import * as React from "react";
import { Download, Pause, Play } from "lucide-react";
import { cn } from "../../lib/cn";
import { Spinner } from "../ui/spinner";

/**
 * AudioPlayer
 * Playback for AI-generated speech and audio: play/pause, a seekable waveform,
 * time, playback speed and download. The waveform doubles as the scrubber.
 * - Click or drag the waveform to seek · ← → seek 5s · Space plays/pauses
 * - Pass real `peaks` (0–1) or get a stable pseudo-waveform from the title
 */
export interface AudioPlayerProps {
  src: string;
  title?: string;
  /** Waveform peaks 0–1. ~48–96 values look best. */
  peaks?: number[];
  /** Show a download button (uses `downloadName`) */
  downloadable?: boolean;
  downloadName?: string;
  rates?: number[];
  className?: string;
}

export function pseudoPeaks(seed: string, count = 64) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Array.from({ length: count }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const r = ((h >>> 0) % 1000) / 1000;
    const env = 0.55 + 0.45 * Math.sin((i / count) * Math.PI);
    return Math.max(0.12, Math.min(1, r * env + 0.1));
  });
}

const fmt = (s: number) => (!isFinite(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`);

export function AudioPlayer({ src, title, peaks, downloadable, downloadName, rates = [1, 1.25, 1.5, 2, 0.75], className }: AudioPlayerProps) {
  const audio = React.useRef<HTMLAudioElement>(null);
  const bar = React.useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [rate, setRate] = React.useState(rates[0]);
  const bars = React.useMemo(() => peaks ?? pseudoPeaks(title ?? src), [peaks, title, src]);
  const progress = duration ? time / duration : 0;
  // Fit bar count to the available width (≈ 4px per bar) by resampling the peaks
  const [fit, setFit] = React.useState(bars.length);
  React.useEffect(() => {
    const el = bar.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setFit(Math.max(12, Math.floor(e.contentRect.width / 4))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const shownBars = React.useMemo(() => {
    if (fit >= bars.length) return bars;
    return Array.from({ length: fit }, (_, i) => {
      const a = Math.floor((i * bars.length) / fit), z = Math.max(a + 1, Math.floor(((i + 1) * bars.length) / fit));
      return Math.max(...bars.slice(a, z));
    });
  }, [bars, fit]);

  React.useEffect(() => { if (audio.current) audio.current.playbackRate = rate; }, [rate]);
  React.useEffect(() => {
    const a = audio.current;
    if (!a || !playing) return;
    let raf = 0;
    const loop = () => { setTime(a.currentTime); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = async () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) { setLoading(true); try { await a.play(); } catch { /* blocked */ } setLoading(false); }
    else a.pause();
  };
  const seekTo = (t: number) => { const a = audio.current; if (!a || !duration) return; a.currentTime = Math.max(0, Math.min(duration, t)); setTime(a.currentTime); };
  const seekFromPointer = (clientX: number) => {
    const r = bar.current!.getBoundingClientRect();
    seekTo(((clientX - r.left) / r.width) * duration);
  };

  return (
    <div className={cn("flex w-full items-center gap-3 rounded-xl border border-border bg-bg p-2.5 pr-3", className)}>
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={(e) => { setPlaying(false); setTime(e.currentTarget.duration); }}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
      />
      <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-bg transition-opacity hover:opacity-90 [&_svg]:size-4">
        {loading ? <Spinner className="size-4" /> : playing ? <Pause className="fill-current" /> : <Play className="ml-0.5 fill-current" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{title}</p>
          <button type="button" onClick={() => setRate(rates[(rates.indexOf(rate) + 1) % rates.length])} aria-label={`Playback speed ${rate}×`}
            className="h-6 min-w-[2.5rem] shrink-0 rounded-md border border-border px-1.5 font-mono text-xs text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
            {rate}×
          </button>
          {downloadable && (
            <a href={src} download={downloadName ?? title ?? "audio"} aria-label="Download audio" className="grid size-6 shrink-0 place-items-center rounded-md text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg [&_svg]:size-3.5">
              <Download />
            </a>
          )}
        </div>
        <div className="mt-1 flex items-center gap-3">
          <div
            ref={bar}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seekFromPointer(e.clientX); }}
            onPointerMove={(e) => { if (e.buttons === 1) seekFromPointer(e.clientX); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); seekTo(time + 5); }
              else if (e.key === "ArrowLeft") { e.preventDefault(); seekTo(time - 5); }
              else if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
              else if (e.key === "Home") { e.preventDefault(); seekTo(0); }
              else if (e.key === "End") { e.preventDefault(); seekTo(duration); }
            }}
            className="flex h-8 min-w-0 flex-1 cursor-pointer touch-none items-center gap-[2px] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20"
          >
            {shownBars.map((p, i) => (
              <span key={i} className={cn("min-w-0 flex-1 rounded-full transition-colors", i / shownBars.length < progress ? "bg-fg" : "bg-fg/20")} style={{ height: `${Math.round(p * 100)}%` }} />
            ))}
          </div>
          <span className="shrink-0 font-mono text-xs tabular-nums text-fg-muted">{fmt(time)} / {fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
