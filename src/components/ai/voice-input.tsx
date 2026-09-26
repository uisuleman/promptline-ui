"use client";

import * as React from "react";
import { Check, Mic, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

/**
 * VoiceInput
 * Dictation for the prompt box. Idle mic → recording bar with live waveform + timer
 * → Cancel (discard) or Done (insert transcript). Pass `level` (0–1) from your audio analyser;
 * without it the bars animate on their own.
 */
export type VoiceState = "idle" | "recording" | "processing";

export interface VoiceInputProps {
  state: VoiceState;
  onStart: () => void;
  onCancel: () => void;
  onDone: () => void;
  /** Live mic level 0–1 */
  level?: number;
  className?: string;
}

export function VoiceInput({ state, onStart, onCancel, onDone, level, className }: VoiceInputProps) {
  const [secs, setSecs] = React.useState(0);
  React.useEffect(() => {
    if (state !== "recording") { setSecs(0); return; }
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  if (state === "idle")
    return (
      <Tooltip label="Dictate">
        <Button variant="ghost" size="icon-sm" onClick={onStart} aria-label="Start dictation" className={className}><Mic /></Button>
      </Tooltip>
    );

  const bars = 24;
  return (
    <div className={cn("flex h-10 items-center gap-2 rounded-full border border-border bg-bg pl-1 pr-1 shadow-sm", className)} role="group" aria-label="Recording">
      <Tooltip label="Cancel"><Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="Cancel recording" className="rounded-full"><X /></Button></Tooltip>
      <span className="size-2 shrink-0 rounded-full bg-danger" style={{ animation: "pl-pulse 1.2s infinite" }} aria-hidden />
      <div className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: bars }).map((_, i) => (
          <span
            key={i}
            className={cn("w-[3px] rounded-full", state === "processing" ? "h-1 bg-fg-subtle" : "h-full bg-fg")}
            style={state === "recording" ? (level != null ? { transform: `scaleY(${Math.max(0.15, level * (0.5 + 0.5 * Math.sin(i * 1.3)))})` } : { animation: `pl-wave ${0.8 + (i % 5) * 0.12}s ${i * 0.04}s infinite ease-in-out` }) : undefined}
          />
        ))}
      </div>
      <span className="w-10 text-right text-xs tabular-nums text-fg-muted" aria-live="off">
        {state === "processing" ? "…" : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`}
      </span>
      <Tooltip label="Done"><Button size="icon-sm" onClick={onDone} disabled={state === "processing"} aria-label="Finish and transcribe" className="rounded-full"><Check /></Button></Tooltip>
    </div>
  );
}
