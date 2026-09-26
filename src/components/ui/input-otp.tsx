"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * InputOTP
 * One-time codes for sign-in and verification. Paste fills every box, Backspace moves back,
 * arrow keys move between boxes, and `onComplete` fires when the last digit is entered.
 * Uses autocomplete="one-time-code" so phones can autofill from SMS.
 */
export interface InputOTPProps {
  length?: number;
  value?: string;
  onValueChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  /** Visual split, e.g. 3 → "123 456" */
  groupSize?: number;
  invalid?: boolean;
  disabled?: boolean;
  pattern?: RegExp;
  className?: string;
}

export function InputOTP({ length = 6, value, onValueChange, onComplete, groupSize = 3, invalid, disabled, pattern = /^[0-9]$/, className }: InputOTPProps) {
  const [inner, setInner] = React.useState("");
  const v = (value ?? inner).slice(0, length);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const set = (nv: string) => {
    setInner(nv); onValueChange?.(nv);
    if (nv.length === length) onComplete?.(nv);
  };
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  return (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label="One-time code">
      {Array.from({ length }).map((_, i) => (
        <React.Fragment key={i}>
          {i > 0 && groupSize && i % groupSize === 0 && <span className="h-px w-3 bg-border-strong" aria-hidden />}
          <input
            ref={(el) => { refs.current[i] = el; }}
            value={v[i] ?? ""}
            disabled={disabled}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={invalid || undefined}
            maxLength={1}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const ch = e.target.value.slice(-1);
              if (!ch || !pattern.test(ch)) return;
              const arr = v.padEnd(length, " ").split("");
              arr[i] = ch;
              set(arr.join("").trimEnd());
              focus(i + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.preventDefault();
                if (v[i]) set(v.slice(0, i));
                else { set(v.slice(0, Math.max(0, i - 1))); focus(i - 1); }
              }
              if (e.key === "ArrowLeft") focus(i - 1);
              if (e.key === "ArrowRight") focus(i + 1);
            }}
            onPaste={(e) => {
              e.preventDefault();
              const txt = e.clipboardData.getData("text").split("").filter((c) => pattern.test(c)).join("").slice(0, length);
              set(txt); focus(txt.length);
            }}
            className={cn(
              "size-10 rounded-md border bg-bg text-center font-mono text-lg text-fg shadow-xs transition-[border-color,box-shadow] caret-transparent focus:outline-none focus:ring-4 disabled:opacity-50",
              invalid ? "border-danger/60 focus:ring-danger/10" : "border-border focus:border-fg focus:ring-fg/5"
            )}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
