---
title: How to Render Streaming LLM Responses in React Without Jank
seoTitle: Streaming LLM Responses in React Without Jank
description: Render a streaming LLM response in React that reads smoothly — decode the stream, smooth token bursts, auto-scroll politely, stop with AbortController.
date: 2026-09-27
weight: 50
topic: tutorials
tags: [react, streaming, llm, nextjs, accessibility]
coverTitle: Streaming LLM responses without jank
coverAlt: Cover image for "How to Render Streaming LLM Responses in React Without Jank", showing an assistant reply being revealed line by line with a blinking caret at the end.
components: [streaming-text, conversation, prompt-input, message, loader, code-block]
tldr:
  - "Read the response with res.body.getReader() and a TextDecoder using { stream: true }, so characters split across chunks don't turn into garbage."
  - Append chunks with a functional state update (setText(t => t + chunk)) so no chunk is lost to a stale closure.
  - Keep the received text and the visible text separate, and reveal the visible text on requestAnimationFrame at a steady pace that speeds up when it falls behind.
  - Auto-scroll only while the reader is at the bottom, and stop following the moment they scroll up.
  - Wire Stop to an AbortController, mark the answer aria-busy while it streams, and skip the animation for people who prefer reduced motion.
faq:
  - q: Why does streamed text from an LLM look jittery?
    a: Models and networks deliver tokens in uneven bursts — nothing for 200ms, then 40 characters at once. If you render each chunk the moment it lands, the text jumps. Revealing it at a steady pace on animation frames turns those bursts into something that reads like typing.
  - q: Why do I need { stream true } in TextDecoder?
    a: A single character like an emoji or an accented letter can take several bytes, and a network chunk can end halfway through one. With stream true the decoder holds the partial bytes until the next chunk arrives instead of emitting a replacement character.
  - q: How do I stop an LLM response that is still streaming in React?
    a: Create an AbortController per request, pass its signal to fetch, and call abort() from your Stop button. The pending read rejects, your loop exits, and you treat the abort as a normal end rather than an error.
  - q: Is it safe to render streaming markdown with dangerouslySetInnerHTML?
    a: Avoid it. Model output is untrusted, and partial markdown turned into HTML can inject markup. Render markdown to React elements instead, and close any unfinished code fence while the text is still streaming.
---

To render a streaming LLM response in React without jank, keep two copies of the text: what you've **received** and what you **show**. Read the fetch stream with a `TextDecoder`, append each chunk with a functional state update, then reveal the visible text on `requestAnimationFrame` at a steady pace. Add polite auto-scroll, a caret, a Stop button and `aria-busy`, and the answer reads like someone typing instead of a slot machine.

This tutorial builds each piece by hand so you understand it, then shows how the [Streaming Text](/components/streaming-text) component from {{brand.name}} does all of it in one line. Everything was tested on Next.js 16, React 19 and Tailwind CSS v4.

## Why does streamed text look jittery?

Tokens don't arrive evenly. A model produces them in small batches, your server may buffer them, and the network groups packets however it likes. On screen that looks like nothing, then half a sentence, then a pause, then three words.

If you render every chunk the moment it lands, the answer lurches forward. Worse, each burst can re-wrap the paragraph and push content down, so the eye loses its place. The fix is not a faster server. It's separating the stream from the reveal: accept chunks as fast as they come, but show them at a pace a person can read.

Here's the difference in practice. Hit **Replay** to watch a bursty stream revealed smoothly:

:::demo streaming-text/Default

## Step 1: Read the fetch stream with TextDecoder

`fetch` gives you the response body as a `ReadableStream` of bytes. Read it with a reader and turn bytes into text with a `TextDecoder`. Wrapping that in an async generator keeps the rest of your code simple: you get a plain `for await` loop over strings.

```ts title="app/read-stream.ts"
// Turns a streaming fetch body into an async iterator of text chunks.
export async function* readTextStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      // stream: true keeps a multi-byte character that was split across chunks
      // in the decoder until the rest of it arrives.
      const text = decoder.decode(value, { stream: true });
      if (text) yield text;
    }
    const rest = decoder.decode(); // flush anything still buffered
    if (rest) yield rest;
  } finally {
    reader.releaseLock();
  }
}
```

The `{ stream: true }` option matters more than it looks. Characters like "é" or an emoji take several bytes, and a network chunk can end in the middle of one. Without the flag, the decoder emits a broken "�" character. With it, the decoder holds the partial bytes until the next chunk completes them. The final `decode()` call flushes anything left over.

This works with any endpoint that streams plain text, like the placeholder route in the [ChatGPT-style chat UI tutorial](/blog/chatgpt-style-chat-ui-nextjs). If your provider sends server-sent events or JSON lines, parse those inside the loop and yield only the text.

## Step 2: Append chunks with a functional state update

The obvious code is `setText(text + chunk)`. It's also a bug. Your loop runs inside one async function, so `text` is the value from the render when that function started. Every chunk overwrites the last one.

Use the functional form instead: `setText((t) => t + chunk)`. React hands you the latest value every time, so no chunk is lost. The same rule applies when the text lives inside a messages array — map over the previous array and update only the message being streamed.

Calling `setState` once per chunk is fine. State updates are cheap, and the smoothing step below decides how often the visible text actually changes.

## Step 3: Smooth the reveal with requestAnimationFrame

Now split "received" from "visible". The received text updates whenever a chunk arrives. The visible text is a slice of it that grows on every animation frame, at a steady number of characters per second.

Two details make it feel right:

- **Speed up when behind.** If a big burst arrives, a fixed speed would leave the reveal trailing seconds behind the stream. Scale the rate with the backlog so the text never lags by much more than a second.
- **Reset on new messages.** When the text gets shorter (a new answer started), jump to the new length instead of animating backwards.

```ts title="app/use-smooth-text.ts"
import * as React from "react";

// Reveals `text` at a steady pace, one animation frame at a time.
// Speeds up when it falls behind, so it never trails the stream by much.
export function useSmoothText(text: string, charsPerSecond = 90) {
  const [count, setCount] = React.useState(text.length);
  const target = React.useRef(text.length);
  const shown = React.useRef(count);
  target.current = text.length;

  // New message (text got shorter): reset instead of animating backwards.
  React.useEffect(() => {
    if (text.length < shown.current) {
      shown.current = text.length;
      setCount(text.length);
    }
  }, [text]);

  React.useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const backlog = target.current - shown.current;
      if (backlog > 0) {
        const rate = reduce ? Infinity : Math.max(charsPerSecond, backlog * 2.5);
        shown.current = Math.min(target.current, shown.current + Math.max(1, Math.round(rate * dt)));
        setCount(shown.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [charsPerSecond]);

  return text.slice(0, count);
}
```

Because the hook only moves forward toward the received length, it doesn't matter whether chunks are one character or five hundred. The reveal stays even either way. This is the same approach the Streaming Text component uses; it even exports its own `useSmoothText` hook if you want the behavior without the markup.

## Step 4: Render partial markdown safely

Models answer in markdown, and while streaming you are always rendering half of a document. Two rules keep that safe and stable.

**Never pipe model output into `dangerouslySetInnerHTML`.** The text is untrusted, and a half-parsed tag is an easy way to break your layout or inject markup. Parse markdown into React elements instead — a library like react-markdown does this, and the Streaming Text component ships a light parser for headings, lists, bold, italic, inline code and code blocks.

**Close unfinished code fences.** Midway through a code block, the opening fence has arrived but the closing one hasn't. Many parsers then treat the rest of the answer as plain text, or the other way around, and the layout flips when the fence finally lands. Close it temporarily before parsing:

```ts title="app/close-open-fences.ts"
// A reply cut off mid code block would swallow everything after it.
// Close the fence temporarily so the partial text still renders as code.
export function closeOpenFences(markdown: string) {
  const fences = markdown.match(/^```/gm)?.length ?? 0;
  return fences % 2 === 1 ? markdown + "\n```" : markdown;
}
```

Once the answer is done, move finished code blocks to a proper [Code Block](/components/code-block) with copy and highlighting. Heavy syntax highlighting on every frame of a stream is wasted work.

## Step 5: Show a caret while text is still coming

A small blinking block at the end of the text tells people the answer isn't finished. It is the cheapest loading state you can add. Two rules:

- Show it while the stream is open **or** the reveal is still catching up, and remove it the moment both are done. A caret on a finished answer looks broken.
- Mark it `aria-hidden` so screen readers don't announce it.

Before the first token, show something else — a pulsing dot or a short status line from the [Loader](/components/loader). The [guide to AI loading states](/blog/ai-loading-states) covers what to show in that gap.

## Step 6: Auto-scroll that stops when the user scrolls up

A long answer grows past the bottom of the screen, so the view should follow it. But the moment someone scrolls up to reread something, yanking them back down is the most annoying bug a chat UI can have.

The logic is small: remember whether the reader is near the bottom, update that on every scroll, and only follow new content while it's true.

```ts title="app/use-stick-to-bottom.ts"
import * as React from "react";

// Follows new content while the reader is at the bottom.
// The moment they scroll up, it stops following until they scroll back down.
export function useStickToBottom<T extends HTMLElement>(content: unknown) {
  const ref = React.useRef<T>(null);
  const stick = React.useRef(true);

  const onScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  }, []);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [content]);

  return { ref, onScroll };
}
```

The 24px threshold forgives being a few pixels off. In a full chat you'll also want a "scroll to latest" button that appears only when the reader has scrolled away. The [Conversation](/components/conversation) component does both, and uses observers so it keeps following even when content grows without a React render (images loading, code blocks expanding).

## Step 7: Stop, accessibility and reduced motion

Put it together in one component. The Stop button aborts the request, and the abort is treated as a normal end, not an error:

```tsx title="app/streamed-answer.tsx"
"use client";

import * as React from "react";
import { readTextStream } from "./read-stream";
import { useSmoothText } from "./use-smooth-text";
import { useStickToBottom } from "./use-stick-to-bottom";

export function StreamedAnswer() {
  const [text, setText] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const controller = React.useRef<AbortController | null>(null);

  const visible = useSmoothText(text);
  const { ref, onScroll } = useStickToBottom<HTMLDivElement>(visible);
  const busy = streaming || visible.length < text.length;

  async function ask(prompt: string) {
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    setText("");
    setStreaming(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);
      for await (const chunk of readTextStream(res.body)) {
        setText((t) => t + chunk); // functional update: never works on a stale copy
      }
    } catch {
      // Stopping is not an error — only show a message for real failures.
      if (!ac.signal.aborted) setText((t) => t + "\n\nSomething went wrong. Try again.");
    } finally {
      if (controller.current === ac) setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col gap-4 p-6">
      <div ref={ref} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto">
        <div aria-live="polite" aria-busy={busy} className="whitespace-pre-wrap leading-7">
          {visible}
          {busy && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] bg-current motion-safe:animate-pulse"
            />
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => (streaming ? controller.current?.abort() : ask("Explain streaming in one paragraph"))}
        className="self-start rounded-md border px-3 py-1.5 text-sm"
      >
        {streaming ? "Stop" : "Ask"}
      </button>
    </div>
  );
}
```

A few things in there are easy to miss:

- **One AbortController per request.** Pass its `signal` to `fetch`. Calling `abort()` makes the pending `read()` reject, the loop exits, and the `catch` checks `signal.aborted` so a stop never shows an error message.
- **`aria-busy` while streaming.** Live regions announce changes, and a region that changes sixty times a second is noise. `aria-busy="true"` asks assistive tech to wait, so people hear the answer when it's complete instead of a stutter of fragments.
- **Reduced motion.** The smoothing hook reveals everything immediately when `prefers-reduced-motion` is set, and the caret only pulses under `motion-safe`. The text still streams; it just doesn't animate.
- **Guard `finally`.** If someone sends a new prompt before the old one finishes, the old request's `finally` shouldn't flip the new one's state. Comparing against `controller.current` handles that.

## Or use the component

Everything above — smoothing, catch-up speed, markdown, the caret, `aria-busy` and reduced motion — is what [Streaming Text](/components/streaming-text) does. Install it with the conversation pieces:

```bash
npx shadcn@latest add @{{brand.slug}}/streaming-text @{{brand.slug}}/conversation @{{brand.slug}}/message @{{brand.slug}}/prompt-input
```

Then you only pass it the text received so far and whether the stream is still open. Here's a complete chat that reuses the stream reader from Step 1:

```tsx title="app/chat.tsx"
"use client";

import * as React from "react";
import { Conversation, ConversationContent } from "@/components/ai/conversation";
import { Message } from "@/components/ai/message";
import { PromptInput, type PromptStatus } from "@/components/ai/prompt-input";
import { StreamingText } from "@/components/ai/streaming-text";
import { readTextStream } from "./read-stream";

type Turn = { id: string; role: "user" | "assistant"; text: string };

export function Chat() {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState("");
  const [status, setStatus] = React.useState<PromptStatus>("ready");
  const controller = React.useRef<AbortController | null>(null);

  async function send(prompt: string) {
    const id = crypto.randomUUID();
    setTurns((t) => [...t, { id: id + "-u", role: "user", text: prompt }, { id, role: "assistant", text: "" }]);
    setInput("");
    setStatus("submitted");
    const ac = new AbortController();
    controller.current = ac;
    try {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ prompt }), signal: ac.signal });
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);
      for await (const chunk of readTextStream(res.body)) {
        setStatus("streaming");
        setTurns((t) => t.map((m) => (m.id === id ? { ...m, text: m.text + chunk } : m)));
      }
      setStatus("ready");
    } catch {
      setStatus(ac.signal.aborted ? "ready" : "error");
    }
  }

  const streaming = status === "submitted" || status === "streaming";
  const lastId = turns[turns.length - 1]?.id;

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col px-4">
      <Conversation>
        <ConversationContent>
          {turns.map((m) => (
            <Message key={m.id} from={m.role}>
              {m.role === "user" ? m.text : <StreamingText text={m.text} isStreaming={streaming && m.id === lastId} />}
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
      <div className="pb-6">
        <PromptInput
          value={input}
          onValueChange={setInput}
          onSubmit={send}
          status={status}
          onStop={() => controller.current?.abort()}
        />
      </div>
    </div>
  );
}
```

The [Prompt Input](/components/prompt-input) turns into a stop button while `status` is `streaming`, the [Message](/components/message) lays out each turn, and Conversation handles the scroll. If you want the whole build with an empty state and suggestions, follow the [Next.js chat tutorial](/blog/chatgpt-style-chat-ui-nextjs).

## Streaming checklist

1. Decode with `{ stream: true }` and flush the decoder at the end.
2. Append with functional updates, never `text + chunk`.
3. Reveal on animation frames, faster when behind, instant under reduced motion.
4. Render markdown to React elements and close open code fences mid-stream.
5. Show a caret only while text is still coming.
6. Follow new content only while the reader is at the bottom.
7. Abort with an AbortController, and treat a stop as success.
8. Mark the answer `aria-busy` until it's complete.

Streaming is one piece of a good chat experience. The [AI chat UI design guide](/blog/ai-chat-ui-design-guide) covers the rest, and the [components](/components) page has everything you need to ship it.
