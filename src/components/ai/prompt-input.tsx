import * as React from "react";
import { ArrowUp, Paperclip, Square, AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Tooltip } from "../ui/tooltip";

/**
 * PromptInput
 * The most important component in any AI product.
 * - Auto-grows up to `maxRows`, then scrolls
 * - Enter sends · Shift+Enter new line · IME-safe
 * - Submit button reflects status: ready → submitted (spinner) → streaming (stop) → error (retry)
 * - Drag & drop files onto the box (onFiles)
 * - Slots: attachments (above text), tools (bottom-left), footer hint
 */
export type PromptStatus = "ready" | "submitted" | "streaming" | "error";

export interface PromptInputProps {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: (value: string) => void;
  onStop?: () => void;
  onFiles?: (files: File[]) => void;
  status?: PromptStatus;
  placeholder?: string;
  disabled?: boolean;
  attachments?: React.ReactNode;
  tools?: React.ReactNode;
  hint?: React.ReactNode;
  maxRows?: number;
  /** Show a counter when approaching this many characters */
  maxLength?: number;
  autoFocus?: boolean;
  /** Runs before the built-in keys. Call e.preventDefault() to stop Enter from sending (used by SlashCommands / MentionPicker). */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function PromptInput({
  value, onValueChange, onSubmit, onStop, onFiles, status = "ready", placeholder = "Ask anything…",
  disabled, attachments, tools, hint, maxRows = 10, maxLength, autoFocus, onKeyDown, className,
}: PromptInputProps) {
  const ta = React.useRef<HTMLTextAreaElement>(null);
  const file = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);
  const busy = status === "submitted" || status === "streaming";
  const tooLong = maxLength != null && value.length > maxLength;
  const canSend = value.trim().length > 0 && !disabled && !busy && !tooLong;

  React.useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 24 * maxRows) + "px";
  }, [value, maxRows]);

  const submit = () => { if (canSend) onSubmit(value); };

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        onDragOver={onFiles ? (e) => { e.preventDefault(); setDrag(true); } : undefined}
        onDragLeave={() => setDrag(false)}
        onDrop={onFiles ? (e) => { e.preventDefault(); setDrag(false); onFiles(Array.from(e.dataTransfer.files)); } : undefined}
        onClick={(e) => { if (e.target === e.currentTarget) ta.current?.focus(); }}
        className={cn(
          "relative flex cursor-text flex-col rounded-xl border bg-bg shadow-sm transition-[border-color,box-shadow] duration-150",
          "focus-within:border-border-strong focus-within:shadow-md",
          status === "error" ? "border-danger/40" : "border-border",
          drag && "border-dashed border-fg-subtle bg-surface",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {drag && <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-xl text-sm font-medium text-fg-muted">Drop files to attach</div>}
        {attachments && <div className="flex flex-wrap gap-2 px-3 pt-3">{attachments}</div>}
        <textarea
          ref={ta}
          rows={1}
          value={value}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Message"
          aria-invalid={tooLong || undefined}
          onChange={(e) => onValueChange(e.target.value)}
          onPaste={onFiles ? (e) => { const f = Array.from(e.clipboardData.files); if (f.length) { e.preventDefault(); onFiles(f); } } : undefined}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
          }}
          className="block w-full resize-none bg-transparent px-4 pb-2 pt-4 text-md text-fg placeholder:text-fg-subtle focus:outline-none"
        />
        <div className="flex items-center gap-1 p-2">
          {onFiles && (
            <>
              <input ref={file} type="file" multiple hidden onChange={(e) => { onFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
              <Tooltip label="Attach files">
                <Button variant="ghost" size="icon-sm" onClick={() => file.current?.click()} aria-label="Attach files"><Paperclip /></Button>
              </Tooltip>
            </>
          )}
          {tools}
          <div className="ml-auto flex items-center gap-3">
            {maxLength != null && value.length > maxLength * 0.8 && (
              <span className={cn("text-xs tabular-nums", tooLong ? "text-danger" : "text-fg-subtle")}>{value.length}/{maxLength}</span>
            )}
            <PromptSubmit status={status} canSend={canSend} onStop={onStop} />
          </div>
        </div>
      </form>
      {hint && <p className="mt-2 text-center text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

function PromptSubmit({ status, canSend, onStop }: { status: PromptStatus; canSend: boolean; onStop?: () => void }) {
  if (status === "streaming")
    return (
      <Tooltip label="Stop">
        <Button size="icon-sm" onClick={onStop} aria-label="Stop generating" className="rounded-full"><Square className="!size-3 fill-current" /></Button>
      </Tooltip>
    );
  if (status === "submitted")
    return <Button size="icon-sm" disabled aria-label="Sending" className="rounded-full !opacity-100"><Spinner className="size-3.5" /></Button>;
  if (status === "error")
    return (
      <Tooltip label="Retry">
        <Button type="submit" size="icon-sm" variant="danger" aria-label="Retry" className="rounded-full"><AlertCircle /></Button>
      </Tooltip>
    );
  return <Button type="submit" size="icon-sm" disabled={!canSend} aria-label="Send message" className="rounded-full"><ArrowUp /></Button>;
}

/** Small ghost button for the tools slot, e.g. "Search", "Deep research". Toggleable. */
export function PromptTool({ active, icon, children, onClick, className }: { active?: boolean; icon?: React.ReactNode; children?: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors [&_svg]:size-4",
        active ? "border-info/30 bg-info/10 text-info" : "border-border text-fg-muted hover:bg-surface-2 hover:text-fg",
        !children && "w-8 justify-center px-0",
        className
      )}
    >
      {icon}{children}
    </button>
  );
}
