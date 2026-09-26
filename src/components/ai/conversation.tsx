"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Conversation
 * Scroll container for a chat thread. Sticks to the bottom while new tokens stream in,
 * stops sticking the moment the user scrolls up, and shows a "scroll to bottom" button.
 *
 * <Conversation>
 *   <ConversationContent>{messages}</ConversationContent>
 * </Conversation>
 */
const Ctx = React.createContext<{ atBottom: boolean; scrollToBottom: (smooth?: boolean) => void } | null>(null);

export function Conversation({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const stick = React.useRef(true);
  const [atBottom, setAtBottom] = React.useState(true);

  const scrollToBottom = React.useCallback((smooth = true) => {
    const el = ref.current;
    if (!el) return;
    stick.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Keep pinned to bottom when content grows (streaming).
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { if (stick.current) el.scrollTop = el.scrollHeight; });
    Array.from(el.children).forEach((c) => ro.observe(c));
    const mo = new MutationObserver(() => { if (stick.current) el.scrollTop = el.scrollHeight; });
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, []);

  const onScroll = () => {
    const el = ref.current!;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    stick.current = bottom;
    setAtBottom(bottom);
  };

  return (
    <Ctx.Provider value={{ atBottom, scrollToBottom }}>
      <div className={cn("relative flex min-h-0 flex-1 flex-col", className)} {...p}>
        <div ref={ref} onScroll={onScroll} role="log" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
        <ConversationScrollButton />
      </div>
    </Ctx.Provider>
  );
}

export function ConversationContent({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8", className)} {...p} />;
}

function ConversationScrollButton() {
  const ctx = React.useContext(Ctx)!;
  return (
    <button
      type="button"
      aria-label="Scroll to latest message"
      tabIndex={ctx.atBottom ? -1 : 0}
      aria-hidden={ctx.atBottom || undefined}
      onClick={() => ctx.scrollToBottom()}
      className={cn(
        "absolute bottom-4 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-border bg-bg text-fg-muted shadow-md transition-all duration-200 hover:text-fg",
        ctx.atBottom ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
      )}
    >
      <ArrowDown className="size-4" />
    </button>
  );
}
