"use client";

import * as React from "react";
import { Captions, Mic, MicOff, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * VoiceMode
 * A live voice conversation: an orb that shows who's talking, the current state in words,
 * optional live captions, and the two controls that matter — mute and end.
 * You own the audio; pass the state and an input/output level (0–1) and the orb follows.
 */
export type VoiceModeState = "connecting" | "listening" | "thinking" | "speaking";

export interface VoiceModeProps {
  state: VoiceModeState;
  /** Current audio level 0–1 (mic while listening, output while speaking) */
  level?: number;
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  onEnd: () => void;
  /** Live caption of what's being said */
  caption?: string;
  captions?: boolean;
  onCaptionsChange?: (on: boolean) => void;
  className?: string;
}

const label: Record<VoiceModeState, string> = { connecting: "Connecting…", listening: "Listening", thinking: "Thinking", speaking: "Speaking" };

export function VoiceOrb({ state, level = 0, muted, size = 160, className }: { state: VoiceModeState; level?: number; muted?: boolean; size?: number; className?: string }) {
  const l = muted && state === "listening" ? 0 : Math.max(0, Math.min(1, level));
  const scale = state === "speaking" ? 1 + l * 0.18 : state === "listening" ? 1 + l * 0.1 : 1;
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }} aria-hidden>
      {state === "listening" && !muted && (
        <span className="absolute inset-0 rounded-full border border-fg/20" style={{ transform: `scale(${1.08 + l * 0.25})`, opacity: 0.3 + l * 0.6, transition: "transform 90ms linear, opacity 90ms linear" }} />
      )}
      <span
        className={cn("absolute inset-[6%] rounded-full", state === "thinking" && "animate-[pl-spin_2.4s_linear_infinite]", state === "connecting" && "animate-[pl-pulse_1.4s_ease-in-out_infinite]")}
        style={{
          background: state === "thinking"
            ? "conic-gradient(from 0deg, rgb(var(--fg)), rgb(var(--fg) / .25), rgb(var(--fg) / .7), rgb(var(--fg)))"
            : "radial-gradient(circle at 35% 30%, rgb(var(--fg) / .55), rgb(var(--fg)) 60%)",
          transform: `scale(${scale})`,
          transition: "transform 90ms linear",
          boxShadow: "0 20px 60px -20px rgb(var(--fg) / .45)",
          opacity: muted && state === "listening" ? 0.35 : 1,
        }}
      />
      {state === "thinking" && <span className="absolute inset-[14%] rounded-full bg-bg/90 blur-[2px]" />}
    </div>
  );
}

export function VoiceMode({ state, level = 0, muted = false, onMutedChange, onEnd, caption, captions = true, onCaptionsChange, className }: VoiceModeProps) {
  return (
    <div className={cn("flex w-full flex-col items-center justify-between gap-8 rounded-2xl border border-border bg-bg px-6 py-8", className)}>
      <p className="text-sm font-medium text-fg-muted" aria-live="polite">
        {muted && state === "listening" ? "You're muted" : label[state]}
      </p>
      <VoiceOrb state={state} level={level} muted={muted} />
      <p className={cn("min-h-[3rem] max-w-sm text-balance text-center text-md text-fg transition-opacity", captions && caption ? "opacity-100" : "opacity-0")}>
        {captions ? caption : ""}
      </p>
      <div className="flex items-center gap-3">
        {onCaptionsChange && (
          <button type="button" onClick={() => onCaptionsChange(!captions)} aria-pressed={captions} aria-label="Captions"
            className={cn("grid size-12 place-items-center rounded-full border transition-colors [&_svg]:size-5", captions ? "border-border bg-surface-2 text-fg" : "border-border text-fg-muted hover:bg-surface")}>
            <Captions />
          </button>
        )}
        <button type="button" onClick={() => onMutedChange?.(!muted)} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"}
          className={cn("grid size-14 place-items-center rounded-full border transition-colors [&_svg]:size-5", muted ? "border-transparent bg-fg text-bg" : "border-border bg-bg text-fg hover:bg-surface")}>
          {muted ? <MicOff /> : <Mic />}
        </button>
        <button type="button" onClick={onEnd} aria-label="End voice chat" className="grid size-14 place-items-center rounded-full bg-danger text-white transition-opacity hover:opacity-90 [&_svg]:size-5">
          <X />
        </button>
      </div>
    </div>
  );
}
