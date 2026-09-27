---
title: Build a ChatGPT-Style Chat UI in Next.js with shadcn (15-Minute Guide)
seoTitle: Build a ChatGPT-Style Chat UI in Next.js with shadcn
description: Build a streaming ChatGPT-style chat UI in Next.js with shadcn and Tailwind — empty state, suggestions, smooth streaming, a stop button and auto-scroll.
date: 2026-09-27
weight: 70
topic: tutorials
tags: [nextjs, shadcn, chat ui, streaming, tailwind]
coverTitle: Build a ChatGPT-style chat UI in Next.js
coverAlt: Cover image for the guide "Build a ChatGPT-style chat UI in Next.js with shadcn", showing a chat window with a user message, a streamed reply and a prompt box.
coverMotif: chat
components: [prompt-input, conversation, message, streaming-text, suggestion, empty-state]
tldr:
  - Create a Next.js app, run shadcn init, and add the {{brand.short}} registry to components.json.
  - Install the theme plus six components with one shadcn CLI command.
  - Build one client component that holds messages and a status — ready, submitted, streaming or error.
  - Start with a fake streaming model, then swap in a real API route without touching the UI.
  - Every piece handles the details that make chat feel good — stop, auto-scroll, smooth streaming, suggestions.
faq:
  - q: Do I need the Vercel AI SDK to build this?
    a: No. The UI only needs text that arrives in chunks. The guide uses a plain fetch stream so it works with any provider; you can use the AI SDK or any other client instead if you prefer.
  - q: Does this work with Tailwind CSS v4?
    a: Yes. New Next.js projects ship with Tailwind v4. You add a small tailwind.config.js that loads the {{brand.short}} preset and point to it from globals.css with @config.
  - q: Why does the chat UI need "use client"?
    a: Chat is interactive — it holds state, listens to keys and streams updates — so it runs in the browser. The page itself can stay a Server Component and render the client chat inside it.
  - q: How do I stop a response that's still generating?
    a: Keep an AbortController for the request. The Prompt Input shows a stop button while streaming; calling abort() on the controller cancels the fetch and the stream ends cleanly.
---

You can build a ChatGPT-style chat interface in Next.js in about 15 minutes: create the app, add the [{{brand.name}}](/) components with the shadcn CLI, and write one client component that streams replies into a conversation. This guide walks through each step with copy-paste code. It was tested on Next.js 16, React 19 and Tailwind CSS v4. For the design reasoning behind each piece, see the [AI chat UI design guide](/blog/ai-chat-ui-design-guide).

By the end you'll have:

- An empty state with starter suggestions
- A prompt box that grows as you type, sends on Enter and turns into a **stop** button while the model answers
- Replies that stream in smoothly, with basic markdown
- A thread that sticks to the bottom while text streams — and stops sticking the moment you scroll up

Here's the prompt box you'll be using. Try typing and sending:

:::demo prompt-input/Default

## What you need

- Node.js 18 or newer
- About 15 minutes
- No API key yet — you'll start with a fake model and connect a real one at the end

## Step 1: Create a Next.js app

```bash
npx create-next-app@latest my-chat
cd my-chat
```

Accept the defaults: TypeScript, Tailwind CSS and the App Router.

## Step 2: Set up shadcn and add the registry

The shadcn CLI copies components into your project, so you own the code. Initialise it once:

```bash
npx shadcn@latest init
```

Then open `components.json` and add the {{brand.short}} registry, so the CLI knows where to find the components:

```json title="components.json"
{
  "registries": {
    "@{{brand.slug}}": "{{brand.url}}/r/{name}.json"
  }
}
```

Keep everything else `init` created in that file — you're only adding the `registries` key.

## Step 3: Install the theme

The theme adds the design tokens (colours, type, radius) and a Tailwind preset that every component uses:

```bash
npx shadcn@latest add @{{brand.slug}}/theme
```

New Next.js projects use Tailwind v4, which has no config file by default, so create one that loads the preset:

```js title="tailwind.config.js"
module.exports = {
  presets: [require("./tailwind.preset.js")],
};
```

Then load the tokens and the config in your global stylesheet, right after the Tailwind import:

```css title="app/globals.css"
@import "tailwindcss";
@import "../styles/{{brand.slug}}-tokens.css";
@config "../tailwind.config.js";
```

You can delete the demo colour variables `create-next-app` put in `globals.css` — the tokens replace them.

## Step 4: Add the chat components

One command installs all six components and the small helpers they share:

```bash
npx shadcn@latest add @{{brand.slug}}/conversation @{{brand.slug}}/message @{{brand.slug}}/prompt-input @{{brand.slug}}/suggestion @{{brand.slug}}/streaming-text @{{brand.slug}}/empty-state
```

They land in `components/ai/` and `components/ui/`. Each file starts with `"use client"`, so they work in the App Router out of the box.

## Step 5: Build the chat

Create `app/chat.tsx`. It keeps two things in state: the list of messages and a **status** that tells every component what's happening. The prompt box, the caret and the stop button all react to that one value.

```tsx title="app/chat.tsx"
"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Conversation, ConversationContent } from "@/components/ai/conversation";
import { Message, AssistantAvatar } from "@/components/ai/message";
import { PromptInput, type PromptStatus } from "@/components/ai/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai/suggestion";
import { StreamingText } from "@/components/ai/streaming-text";
import { EmptyState } from "@/components/ai/empty-state";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

const starters = [
  "Plan a launch week for my app",
  "Write a friendly onboarding email",
  "Explain RAG like I'm five",
];

// Stand-in for a real model: streams a canned reply in small chunks.
async function* fakeModel(prompt: string, signal: AbortSignal) {
  const reply = `Here's a first take on "${prompt}":\n\n- Start with the outcome your user wants\n- Keep the first version small\n- Ship it, then **iterate on real feedback**`;
  for (let i = 0; i < reply.length; i += 6) {
    await new Promise((r) => setTimeout(r, 40));
    if (signal.aborted) return;
    yield reply.slice(i, i + 6);
  }
}

export function Chat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [status, setStatus] = React.useState<PromptStatus>("ready");
  const abort = React.useRef<AbortController | null>(null);

  async function send(text: string) {
    const id = crypto.randomUUID();
    setMessages((m) => [...m, { id: id + "-user", role: "user", text }, { id, role: "assistant", text: "" }]);
    setInput("");
    setStatus("submitted");
    abort.current = new AbortController();
    try {
      for await (const chunk of fakeModel(text, abort.current.signal)) {
        setStatus("streaming");
        setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: msg.text + chunk } : msg)));
      }
      setStatus("ready");
    } catch {
      // Stopping aborts the request — that's not an error.
      setStatus(abort.current?.signal.aborted ? "ready" : "error");
    }
  }

  const busy = status === "submitted" || status === "streaming";
  const lastId = messages[messages.length - 1]?.id;

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col px-4">
      <Conversation>
        <ConversationContent className="py-8">
          {messages.length === 0 ? (
            <EmptyState icon={<Sparkles />} title="What can I help with?" description="Ask anything, or start with an idea below.">
              <Suggestions className="flex-wrap justify-center">
                {starters.map((s) => <Suggestion key={s} suggestion={s} onPick={send} />)}
              </Suggestions>
            </EmptyState>
          ) : (
            messages.map((m) =>
              m.role === "user" ? (
                <Message key={m.id} from="user">{m.text}</Message>
              ) : (
                <Message key={m.id} from="assistant" avatar={<AssistantAvatar />}>
                  <StreamingText text={m.text} isStreaming={busy && m.id === lastId} />
                </Message>
              )
            )
          )}
        </ConversationContent>
      </Conversation>
      <div className="pb-6">
        <PromptInput
          value={input}
          onValueChange={setInput}
          onSubmit={send}
          status={status}
          onStop={() => { abort.current?.abort(); setStatus("ready"); }}
          hint="AI can make mistakes. Check important info."
        />
      </div>
    </div>
  );
}
```

## Step 6: Put it on the page

Replace `app/page.tsx`. The page stays a Server Component and simply renders the client chat:

```tsx title="app/page.tsx"
import { Chat } from "./chat";

export default function Page() {
  return <Chat />;
}
```

Run `npm run dev` and open [localhost:3000](http://localhost:3000). You'll see the empty state first:

![Empty state with a heading, a short description and three starter suggestions above the prompt box](/blog/chat-ui-empty-state.webp "The empty state doubles as onboarding: starter prompts show people what to ask.")

Pick a suggestion or type a message, and the reply streams in:

![A conversation with user messages on the right and streamed assistant replies on the left](/blog/chat-ui-conversation.webp "User messages sit on the right; assistant replies stream in on the left.")

## Why it feels right

A chat UI is mostly states and edge cases. Here's what each component handles so you don't have to:

- **One status drives everything.** `ready → submitted → streaming → ready` (or `error`). The send button shows a spinner while waiting, turns into a stop button while streaming, and a retry button on error — see the [Prompt Input](/components/prompt-input) states.
- **Streaming that doesn't stutter.** Models send text in bursts. [Streaming Text](/components/streaming-text) smooths those bursts into an even reveal and speeds up when it falls behind, so text never lags far behind the stream. The full technique is in [how to render streaming LLM responses in React](/blog/streaming-llm-response-react).
- **Scroll that respects the reader.** [Conversation](/components/conversation) sticks to the bottom while text arrives, but the moment someone scrolls up to reread, it stops following and shows a "scroll to bottom" button. More on what to show while people wait in [AI loading states](/blog/ai-loading-states).
- **An empty state that teaches.** A blank screen with a text box makes people guess. Two or three concrete [suggestions](/components/suggestion) show what the product is good at — see [the empty state as onboarding](/blog/ai-empty-state-onboarding).

Here's the smooth streaming on its own — hit **Replay** to watch it again:

:::demo streaming-text/Default

## Connect a real model

The UI only needs text that arrives in chunks, so connecting a model means replacing `fakeModel` with a function that reads from your own API route. Create the route first. This placeholder streams plain text — swap its loop for your model provider's streaming call:

```ts title="app/api/chat/route.ts"
// A placeholder that streams plain text. Swap the loop for your model provider's streaming call.
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const words = `You asked: "${prompt}". Replace this route with a call to your model provider.`.split(" ");
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 50));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```

Then add a reader in `app/chat.tsx` and use it instead of `fakeModel`:

```tsx title="app/chat.tsx"
// Reads a plain-text stream from your API route, chunk by chunk.
async function* streamFromApi(prompt: string, signal: AbortSignal) {
  const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ prompt }), signal });
  if (!res.ok || !res.body) throw new Error("Request failed");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) return;
    yield decoder.decode(value, { stream: true });
  }
}

// In send(), change one line:
// for await (const chunk of streamFromApi(text, abort.current.signal)) {
```

Because the request uses the same `AbortController`, the stop button now cancels the real network request too. If you'd rather use a library, the [Vercel AI SDK](https://ai-sdk.dev) handles provider streaming for you — the components don't care where the text comes from. Comparing options? See [the best AI chat UI kits in 2026](/blog/best-ai-chat-ui-kits).

## Polish checklist before you ship

1. **Show an error state.** When `status` is `error`, the prompt box offers a retry. Tell people what happened in plain words — a [Status Banner](/components/status-banner) works well for rate limits ([usage limits UX](/blog/ai-usage-limits-paywall-ux) covers the details).
2. **Let people copy and retry answers.** Add [Actions](/components/actions) under each assistant message.
3. **Show the model working on long tasks.** [Reasoning](/components/reasoning) and [Tool](/components/tool) make waits feel shorter and build trust — see [agentic UX](/blog/agentic-ux-design).
4. **Handle usage limits honestly.** A [Usage Meter](/components/usage-meter) near the prompt beats a surprise "limit reached" wall.
5. **Check the keyboard path.** Enter sends, Shift+Enter adds a line, Esc closes menus — try the whole flow without a mouse.

That's a complete, streaming chat UI — built from components you own and can restyle, with the interaction details already handled. Browse the [AI components](/components) to add attachments, a model picker, citations or approvals next — or add [slash commands and @mentions](/blog/slash-commands-mentions-react) to the prompt box. Want Cursor or Claude to install components for you? Follow the [shadcn MCP server guide](/blog/shadcn-mcp-server-guide).
