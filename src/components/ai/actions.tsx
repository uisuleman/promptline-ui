import * as React from "react";
import { Check, Copy, RotateCcw, Share, ThumbsDown, ThumbsUp, Volume2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { useCopy } from "../../lib/hooks";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

/**
 * Actions
 * Row of icon actions under a message. Compose freely:
 * <Actions><CopyAction text={t}/><Action label="Retry" onClick={..}><RotateCcw/></Action><FeedbackActions .../></Actions>
 * `reveal="hover"` hides them until the message is hovered (desktop only — always visible on touch).
 */
export function Actions({ className, reveal, ...p }: React.HTMLAttributes<HTMLDivElement> & { reveal?: "always" | "hover" }) {
  return (
    <div
      role="toolbar"
      aria-label="Message actions"
      className={cn(
        "-ml-2 flex items-center gap-0.5 transition-opacity duration-150",
        reveal === "hover" && "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/msg:opacity-100 [@media(hover:hover)]:focus-within:opacity-100",
        className
      )}
      {...p}
    />
  );
}

export function Action({ label, className, children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <Tooltip label={label}>
      <Button variant="ghost" size="icon-xs" aria-label={label} className={className} {...p}>{children}</Button>
    </Tooltip>
  );
}

export function CopyAction({ text }: { text: string }) {
  const { copied, copy } = useCopy();
  return <Action label={copied ? "Copied" : "Copy"} onClick={() => copy(text)}>{copied ? <Check /> : <Copy />}</Action>;
}

export function RetryAction({ onClick }: { onClick: () => void }) {
  return <Action label="Regenerate" onClick={onClick}><RotateCcw /></Action>;
}

export function ReadAloudAction({ onClick, active }: { onClick: () => void; active?: boolean }) {
  return <Action label={active ? "Stop reading" : "Read aloud"} onClick={onClick} aria-pressed={active} className={cn(active && "text-fg")}><Volume2 /></Action>;
}

export function ShareAction({ onClick }: { onClick: () => void }) {
  return <Action label="Share" onClick={onClick}><Share /></Action>;
}

export type FeedbackValue = "up" | "down" | null;
export function FeedbackActions({ value, onValueChange }: { value: FeedbackValue; onValueChange: (v: FeedbackValue) => void }) {
  const t = (v: FeedbackValue) => onValueChange(value === v ? null : v);
  return (
    <>
      <Action label="Good response" aria-pressed={value === "up"} onClick={() => t("up")} className={cn(value === "up" && "text-fg")}>
        <ThumbsUp className={cn(value === "up" && "fill-current")} />
      </Action>
      <Action label="Bad response" aria-pressed={value === "down"} onClick={() => t("down")} className={cn(value === "down" && "text-fg")}>
        <ThumbsDown className={cn(value === "down" && "fill-current")} />
      </Action>
    </>
  );
}

export function ActionsMeta({ className, ...p }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-2 text-xs text-fg-subtle", className)} {...p} />;
}
