import * as React from "react";
import { ArrowUp, Check, CornerDownLeft, RotateCcw, Sparkles, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Spinner } from "../ui/spinner";

/**
 * InlineAI
 * AI inside a document or editor instead of a chat: select text → quick actions or a custom instruction
 * → a suggested rewrite shown as a diff → Accept / Retry / Discard.
 * Keeps the user in their work; the AI edits in place.
 */
export interface InlineAIAction { id: string; label: string; icon?: React.ReactNode }

export const defaultInlineActions: InlineAIAction[] = [
  { id: "improve", label: "Improve writing" },
  { id: "shorten", label: "Make shorter" },
  { id: "friendly", label: "Friendlier tone" },
  { id: "fix", label: "Fix spelling & grammar" },
];

export type InlineAIState = "idle" | "generating" | "review";

export interface InlineAIProps {
  /** The selected text */
  original: string;
  /** The AI rewrite (shown in review state) */
  suggestion?: string;
  state: InlineAIState;
  actions?: InlineAIAction[];
  onAction: (id: string) => void;
  onPrompt: (instruction: string) => void;
  onAccept: () => void;
  onRetry: () => void;
  onDiscard: () => void;
  className?: string;
}

export function InlineAI({ original, suggestion, state, actions = defaultInlineActions, onAction, onPrompt, onAccept, onRetry, onDiscard, className }: InlineAIProps) {
  const [instruction, setInstruction] = React.useState("");
  return (
    <div
      role="dialog"
      aria-label="Edit with AI"
      className={cn("w-full max-w-md overflow-hidden rounded-lg border border-border bg-bg text-sm shadow-lg", className)}
      style={{ animation: "pl-pop .15s var(--ease-out)" }}
      onKeyDown={(e) => { if (e.key === "Escape") onDiscard(); }}
    >
      {state !== "review" ? (
        <>
          <form onSubmit={(e) => { e.preventDefault(); if (instruction.trim()) onPrompt(instruction); }} className="flex h-11 items-center gap-2 border-b border-border px-3">
            {state === "generating" ? <Spinner className="size-4 text-fg-muted" /> : <Sparkles className="size-4 shrink-0 text-fg-muted" />}
            <input
              autoFocus
              disabled={state === "generating"}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={state === "generating" ? "Writing…" : "Tell AI what to do with the selection…"}
              aria-label="Instruction"
              className="min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none disabled:opacity-60"
            />
            <Button type="submit" size="icon-xs" disabled={!instruction.trim() || state === "generating"} aria-label="Run" className="rounded-full"><ArrowUp /></Button>
          </form>
          <ul className="p-1" role="menu" aria-label="Quick actions">
            {actions.map((a) => (
              <li key={a.id} role="none">
                <button type="button" role="menuitem" disabled={state === "generating"} onClick={() => onAction(a.id)} className="flex h-8 w-full items-center gap-2 rounded-sm px-2 text-left text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-50 [&_svg]:size-4">
                  {a.icon}{a.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="space-y-2 p-3">
            <p className="text-xs font-medium text-fg-subtle">Suggested edit</p>
            <p className="rounded-sm bg-danger/[0.06] px-2 py-1 text-fg-muted line-through decoration-danger/40">{original}</p>
            <p className="rounded-sm bg-success/[0.08] px-2 py-1 text-fg">{suggestion}</p>
          </div>
          <div className="flex items-center gap-2 border-t border-border bg-surface px-3 py-2">
            <Button size="xs" onClick={onAccept} autoFocus><Check />Accept <Kbd className="ml-1 border-accent-fg/20 bg-transparent text-accent-fg/70"><CornerDownLeft className="!size-2.5" /></Kbd></Button>
            <Button size="xs" variant="ghost" onClick={onRetry}><RotateCcw />Retry</Button>
            <Button size="xs" variant="ghost" onClick={onDiscard} className="ml-auto"><X />Discard</Button>
          </div>
        </>
      )}
    </div>
  );
}

/** Floating trigger shown next to a text selection. */
export function InlineAITrigger({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 text-sm font-medium text-fg shadow-md transition-colors hover:bg-surface-2", className)}>
      <Sparkles className="size-3.5" />Edit with AI <Kbd>⌘J</Kbd>
    </button>
  );
}
