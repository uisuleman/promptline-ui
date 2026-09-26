import * as React from "react";
import { AlertCircle, Check, Eye, EyeOff, KeyRound } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

/**
 * ApiKeyInput
 * For bring-your-own-key products. Masked by default · show/hide · paste-friendly
 * · async verify with idle → checking → valid | invalid. After saving, show only the last 4 chars.
 */
export type KeyStatus = "idle" | "checking" | "valid" | "invalid";

export interface ApiKeyInputProps {
  value: string;
  onValueChange: (v: string) => void;
  onVerify?: () => void;
  status?: KeyStatus;
  label?: string;
  provider?: string;
  placeholder?: string;
  helpText?: React.ReactNode;
  errorText?: string;
  className?: string;
}

export function ApiKeyInput({ value, onValueChange, onVerify, status = "idle", label = "API key", provider, placeholder = "sk-…", helpText, errorText = "That key didn't work. Check it's copied in full and has access to this model.", className }: ApiKeyInputProps) {
  const [show, setShow] = React.useState(false);
  const id = React.useId();
  const hid = `${id}-help`;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-fg">{label}</label>
        {provider && <span className="text-xs text-fg-subtle">{provider}</span>}
      </div>
      <div className="flex gap-2">
        <div className={cn(
          "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border bg-bg px-3 shadow-xs transition-[border-color,box-shadow] focus-within:ring-4",
          status === "invalid" ? "border-danger/50 focus-within:ring-danger/10" : status === "valid" ? "border-success/50 focus-within:ring-success/10" : "border-border focus-within:border-border-strong focus-within:ring-fg/5"
        )}>
          <KeyRound className="size-4 shrink-0 text-fg-subtle" />
          <input
            id={id}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onValueChange(e.target.value.trim())}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={status === "invalid" || undefined}
            aria-describedby={hid}
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          {status === "valid" && <Check className="size-4 shrink-0 text-success" />}
          {status === "invalid" && <AlertCircle className="size-4 shrink-0 text-danger" />}
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide key" : "Show key"} className="shrink-0 text-fg-subtle hover:text-fg">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {onVerify && (
          <Button variant="outline" onClick={onVerify} disabled={!value || status === "checking"} className="w-20">
            {status === "checking" ? <Spinner className="size-3.5" /> : "Verify"}
          </Button>
        )}
      </div>
      <p id={hid} className={cn("text-xs", status === "invalid" ? "text-danger" : status === "valid" ? "text-success" : "text-fg-subtle")} aria-live="polite">
        {status === "invalid" ? errorText : status === "valid" ? `Connected · key ending in ${value.slice(-4)}` : helpText}
      </p>
    </div>
  );
}
