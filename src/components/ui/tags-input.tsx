import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * TagsInput
 * Type and press Enter or comma to add a tag. Paste a list and it splits on commas and new lines.
 * Backspace on an empty field selects the last tag, a second Backspace removes it.
 * Duplicates are ignored, `validate` can reject a value with a message, and `max` caps the count.
 */
export interface TagsInputProps {
  value: string[];
  onValueChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  /** Return an error message to reject a tag */
  validate?: (tag: string) => string | undefined;
  /** Keys that commit the current text (default Enter and ",") */
  separators?: string[];
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

export function TagsInput({ value, onValueChange, placeholder = "Add…", max, validate, separators = ["Enter", ","], disabled, id, className, ...aria }: TagsInputProps) {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [armed, setArmed] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const full = max != null && value.length >= max;

  const add = (raw: string[]) => {
    const next = [...value];
    let err: string | undefined;
    for (const r of raw) {
      const t = r.trim();
      if (!t || next.includes(t)) continue;
      if (max != null && next.length >= max) { err = `Up to ${max} allowed`; break; }
      const e = validate?.(t);
      if (e) { err = e; continue; }
      next.push(t);
    }
    if (next.length !== value.length) onValueChange(next);
    setError(err);
    return !err;
  };

  const remove = (i: number) => { onValueChange(value.filter((_, j) => j !== i)); input.current?.focus(); };

  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={() => input.current?.focus()}
        className={cn("flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border bg-bg px-1.5 py-1 text-sm shadow-xs transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:ring-4 focus-within:ring-fg/5",
          error ? "border-danger/50" : "border-border", disabled && "pointer-events-none opacity-50")}
      >
        {value.map((t, i) => (
          <span key={t} className={cn("inline-flex h-6 max-w-full items-center gap-1 rounded-sm bg-surface-2 pl-2 pr-0.5 text-sm text-fg transition-shadow", armed && i === value.length - 1 && "ring-2 ring-fg/30")}>
            <span className="truncate">{t}</span>
            <button type="button" tabIndex={-1} onClick={(e) => { e.stopPropagation(); remove(i); }} aria-label={`Remove ${t}`} className="grid size-5 place-items-center rounded-xs text-fg-subtle hover:bg-border hover:text-fg"><X className="size-3" /></button>
          </span>
        ))}
        <input
          ref={input}
          id={id}
          value={text}
          disabled={disabled || full}
          placeholder={full ? `Limit of ${max} reached` : value.length ? "" : placeholder}
          {...aria}
          aria-invalid={!!error || aria["aria-invalid"] || undefined}
          aria-describedby={[error ? `${id ?? "tags"}-err` : "", aria["aria-describedby"] ?? ""].filter(Boolean).join(" ") || undefined}
          onChange={(e) => { setText(e.target.value); setArmed(false); if (error) setError(undefined); }}
          onBlur={() => { if (text.trim() && add([text])) setText(""); setArmed(false); }}
          onPaste={(e) => {
            const s = e.clipboardData.getData("text");
            if (/[,\n\t]/.test(s)) { e.preventDefault(); add(s.split(/[,\n\t]/)); }
          }}
          onKeyDown={(e) => {
            if (separators.includes(e.key) && !e.nativeEvent.isComposing) {
              if (text.trim()) { e.preventDefault(); if (add([text])) setText(""); }
              else if (e.key !== "Enter") e.preventDefault();
            } else if (e.key === "Backspace" && !text && value.length) {
              e.preventDefault();
              if (armed) { remove(value.length - 1); setArmed(false); } else setArmed(true);
            } else if (e.key === "Escape") setArmed(false);
          }}
          className="h-6 min-w-[6rem] flex-1 bg-transparent px-1 text-sm text-fg placeholder:text-fg-subtle focus:outline-none disabled:cursor-not-allowed"
        />
      </div>
      <div className="mt-1.5 flex justify-between gap-3 text-xs">
        <p id={`${id ?? "tags"}-err`} className="text-danger" aria-live="polite">{error}</p>
        {max != null && <p className={cn("shrink-0 tabular-nums", full ? "text-fg-muted" : "text-fg-subtle")}>{value.length}/{max}</p>}
      </div>
    </div>
  );
}
