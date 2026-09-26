import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Message
 * One turn in a conversation.
 * - user: right-aligned soft bubble (max 80% width)
 * - assistant: full width, no bubble, reads like a document
 * `header` sits above the body (Reasoning, Tool), `footer` below (Actions, Sources).
 */
export interface MessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  from: "user" | "assistant";
  avatar?: React.ReactNode;
  /** Name + time shown above the content, e.g. in multiplayer or support chats */
  meta?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Message({ from, avatar, meta, header, footer, className, children, ...p }: MessageProps) {
  if (from === "user") {
    return (
      <div className={cn("group/msg flex flex-col items-end gap-2", className)} data-from="user" style={{ animation: "pl-in .2s ease-out" }} {...p}>
        {meta && <div className="text-xs text-fg-subtle">{meta}</div>}
        <div className="flex max-w-[80%] items-end gap-3">
          <div className="min-w-0 whitespace-pre-wrap break-words rounded-xl rounded-br-xs bg-surface-2 px-4 py-2 text-md text-fg">{children}</div>
          {avatar}
        </div>
        {footer}
      </div>
    );
  }
  return (
    <div className={cn("group/msg flex gap-4", className)} data-from="assistant" style={{ animation: "pl-in .2s ease-out" }} {...p}>
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {meta && <div className="text-xs text-fg-subtle">{meta}</div>}
        {header}
        <MessageBody>{children}</MessageBody>
        {footer}
      </div>
    </div>
  );
}

/** Prose styles for rendered markdown inside an assistant message. */
export function MessageBody({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "min-w-0 break-words text-md text-fg",
        "[&_p+p]:mt-4 [&_p+ul]:mt-3 [&_ul+p]:mt-4 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
        "[&_strong]:font-semibold [&_a]:underline [&_a]:decoration-border-strong [&_a]:underline-offset-4 hover:[&_a]:decoration-fg",
        "[&_:not(pre)>code]:rounded-xs [&_:not(pre)>code]:bg-surface-2 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm",
        className
      )}
      {...p}
    />
  );
}

/** Default assistant avatar — neutral mark, swap for your logo. */
export function AssistantAvatar({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("grid size-8 place-items-center rounded-full border border-border bg-bg text-fg shadow-xs [&_svg]:size-4", className)}>
      {children ?? (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13 6.4 8.6 2 7l4.4-1.6z" /></svg>
      )}
    </span>
  );
}
