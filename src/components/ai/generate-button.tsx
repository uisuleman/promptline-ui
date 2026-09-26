import * as React from "react";
import { Check, Sparkles, Square } from "lucide-react";
import { cn } from "../../lib/cn";
import { Spinner } from "../ui/spinner";

/**
 * GenerateButton
 * The single "✨ Generate" button that appears all over AI products (write a description,
 * fill a form, summarise). States: idle → generating (cancellable) → done (brief check) → idle.
 * Keeps its width while the label changes so the layout doesn't shift.
 */
export type GenerateState = "idle" | "generating" | "done";

export interface GenerateButtonProps {
  state: GenerateState;
  onGenerate: () => void;
  onCancel?: () => void;
  label?: string;
  generatingLabel?: string;
  doneLabel?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
}

export function GenerateButton({ state, onGenerate, onCancel, label = "Generate", generatingLabel = "Generating…", doneLabel = "Done", variant = "outline", size = "md", className }: GenerateButtonProps) {
  const v = {
    primary: "bg-accent text-accent-fg hover:bg-accent/85",
    outline: "border border-border bg-bg text-fg shadow-xs hover:bg-surface-2 hover:border-border-strong",
    ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  }[variant];
  const s = size === "sm" ? "h-8 px-3 text-sm gap-1.5" : "h-9 px-4 text-base gap-2";
  const gen = state === "generating";

  return (
    <button
      type="button"
      onClick={gen ? onCancel : onGenerate}
      aria-live="polite"
      aria-busy={gen}
      className={cn("group/gen relative inline-grid place-items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 [&_svg]:size-4", v, s, className)}
    >
      {/* width reservation: render all labels invisibly in the same cell */}
      {[label, generatingLabel, doneLabel].map((l) => <span key={l} aria-hidden className="invisible col-start-1 row-start-1 flex items-center gap-2"><Sparkles />{l}</span>)}
      <span className="col-start-1 row-start-1 flex items-center gap-2">
        {state === "idle" && <><Sparkles />{label}</>}
        {gen && (
          <>
            <span className="relative grid place-items-center">
              <Spinner className="size-4 group-hover/gen:opacity-0" />
              {onCancel && <Square className="absolute !size-3 fill-current opacity-0 group-hover/gen:opacity-100" />}
            </span>
            <span className="group-hover/gen:hidden">{generatingLabel}</span>
            {onCancel && <span className="hidden group-hover/gen:inline">Stop</span>}
          </>
        )}
        {state === "done" && <><Check className="text-success" />{doneLabel}</>}
      </span>
    </button>
  );
}
