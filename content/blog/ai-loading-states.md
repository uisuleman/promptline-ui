---
title: How to Design AI Loading States That Don't Feel Slow
seoTitle: "AI Loading States: Design Waits That Don't Feel Slow"
description: "Design AI loading states that feel fast: the four request phases, timing guidelines, spinners vs skeletons vs shimmer, streaming, Stop, and error handling."
date: 2026-09-27
topic: ai-ux-patterns
tags: [loading states, streaming, ai ux, performance, accessibility]
coverTitle: AI loading states that don't feel slow
coverAlt: 'Cover image for "How to Design AI Loading States That Don''t Feel Slow", showing a shimmering status line, a collapsed reasoning panel and a streaming reply with a caret.'
components: [loader, reasoning, tool, streaming-text, skeleton, prompt-input, research-progress, status-banner]
tldr:
  - Every AI request moves through four phases — submitted, thinking, streaming and done — and each one needs its own visual state.
  - Show feedback almost immediately after submit; a silent screen reads as broken long before a visible wait does.
  - Use a Loader for waiting on the model, a Skeleton for loading known content and a spinner only inside small buttons.
  - Replace generic spinners with status text, visible reasoning and tool steps so the wait looks like work.
  - Always offer Stop, smooth bursty tokens into an even reveal, respect reduced motion and give timeouts a clear next step.
faq:
  - q: What should an AI app show while waiting for the first token?
    a: Show a lightweight indicator right away — animated dots or a pulse — and replace it with a status line like "Searching the web…" as soon as you know what the model is doing. The goal is to confirm the request was received and show that the wait is productive.
  - q: Should I use a skeleton or a spinner for AI responses?
    a: Neither, usually. Skeletons are for content whose shape you already know, like a saved conversation. Spinners suit short waits inside buttons. For an AI response you don't know the length or shape of the answer, so a loader with status text works better.
  - q: How do I make streaming text look smooth?
    a: Buffer incoming tokens and reveal them at a steady rate instead of printing each chunk as it arrives. Speed the reveal up when the backlog grows so the text never trails the stream by more than about a second.
  - q: How long should I wait before timing out an AI request?
    a: It depends on the task — a chat reply and a research report have very different normal durations. Set the timeout per task type, show progress well before it, and when it fires, keep the user's message and offer a one-click retry.
---

AI loading states are the screens people see between pressing Enter and getting a finished answer — and in AI products, that's a lot of the experience. Good ones don't make the model faster; they make the wait legible. The recipe: acknowledge the request instantly, show what the model is doing instead of a bare spinner, stream the answer smoothly, and always let people stop.

This post is part of the [AI UX patterns](/blog/ai-ux-patterns) series. It breaks the wait into its phases and shows which component fits each one.

## What are the phases of an AI request?

Every request moves through the same four phases. Designing each one separately is what keeps the experience from feeling like one long, anxious spinner.

1. **Submitted.** The request has left the browser but nothing has come back. The user's only question: "Did it work?"
2. **Thinking.** The model is reasoning, calling tools or searching. The question becomes "Is it doing something useful?"
3. **Streaming.** Text is arriving. Now the question is "Can I read this comfortably, and can I stop it?"
4. **Done** — or **error**. The answer is complete, or something failed and the user needs a next step.

In code, this is one `status` value that every component reads. [Prompt Input](/components/prompt-input) uses exactly these states: the send button becomes a spinner on `submitted`, a Stop button while `streaming`, and a retry button on `error`.

:::demo prompt-input/Statuses

## How fast should feedback appear?

These are design guidelines, not measured laws — tune them against your own product:

- **Instantly (well under half a second):** acknowledge the submit. The message appears in the thread, the input clears, and the button changes state. {{brand.short}}'s guideline is to show something within about 300ms.
- **After a second or so:** show a loader in the reply slot. A silent screen for a second feels broken; a visible wait of several seconds feels fine.
- **After a few seconds:** replace the generic loader with specific status — "Reading 3 files…", "Searching the web…". Now the user knows why it's taking time.
- **Beyond the time people will watch** — roughly tens of seconds: switch from "wait here" to "we'll keep working". Show phases, elapsed time and a Stop button, and let people leave.

The pattern behind all four: the longer the wait, the more information you owe the user.

## Skeleton, spinner, loader or shimmer — which one?

These look similar but mean different things. Mixing them up is one of the most common loading-state mistakes.

### Loader: waiting on the model

A [Loader](/components/loader) — dots, pulse or bars — fills the gap before the first token. You don't know how long the answer will be or what shape it takes, so don't pretend you do. Place it where the answer will appear, so the eye is already in the right spot when text lands.

### Shimmer text: live status

Shimmer text uses the status label itself as the loading indicator. "Searching the web…" with a light sweep across it tells people both *that* something is happening and *what*. Prefer it over a bare spinner whenever you know the current step.

:::demo loader/ShimmerAndCursor

### Skeleton: loading known content

A [Skeleton](/components/skeleton) is for content whose layout you already know: a saved conversation, the history list, a settings card. Shape it like the real content so nothing jumps when data arrives. Don't use a skeleton for a model response — a fake three-line paragraph that turns into a twenty-line answer is a lie the layout tells.

### Spinner: small, short waits

A spinner belongs inside buttons and inline actions: saving a setting, verifying an API key. It's too small and too vague to carry a wait of several seconds on its own.

## How do you show reasoning and tool steps?

The best loading state is real progress. If your model reasons or calls tools, show it — it turns dead time into evidence of work.

**Reasoning.** [Reasoning](/components/reasoning) opens automatically while the model thinks, with a shimmering "Thinking…" label, then collapses to "Thought for 8s" once the answer starts. The thinking earns trust during the wait and gets out of the way after it.

**Tool calls.** Each call gets a [Tool](/components/tool) row with a human title, a status badge and a duration. The component covers the full lifecycle — pending, running, awaiting approval, completed, error and denied. Successes stay collapsed; errors open automatically because they need attention.

Keep this layer quieter than the answer: smaller text, muted color. Process comes first, answer second, actions last — and the answer should always be the loudest thing on screen.

## How do you show progress on long AI tasks?

Deep research, background agents and batch jobs can run for minutes. At that length, a spinner in the thread isn't enough.

[Research Progress](/components/research-progress) shows the plan's phases with the active one highlighted, a live feed of the sources being read, a running count and the elapsed time. When the work finishes, it collapses to one line with the report one click away. For jobs that run in the background, [Agent Runs](/components/agent-runs) gives people a place to leave and come back to.

Three rules for long tasks:

- **Show the current step, not just a percentage.** "Reading page 13 of 20" is more believable than "62%", especially when you can't really estimate the total.
- **Show elapsed time.** People tolerate long waits better when they can see how long it's been.
- **Let people leave.** If the task continues without the tab open, say so.

The [deep research UI](/blog/deep-research-ui) post goes further into long-running work.

## Why every loading state needs a Stop button

Waiting is only tolerable when it's optional. If a response is heading in the wrong direction, people want out now, not after it finishes.

- **Put Stop where Send was.** Prompt Input swaps the send button for Stop while streaming, so it's under the cursor that just clicked.
- **Stop means stop.** Abort the network request, not just the animation. Keep whatever text has already arrived.
- **Stopping isn't an error.** Don't show a red banner when the user chose to stop. Return to ready.

## How do you make streaming feel smooth?

Tokens arrive in bursts: nothing for a moment, then a dozen words at once. Printing each burst as it lands makes the answer stutter.

[Streaming Text](/components/streaming-text) buffers incoming text and reveals it at an even pace, speeding up when the backlog grows so it never trails far behind the stream. A caret blinks while text is still arriving and disappears when the answer is done. The [streaming LLM responses in React](/blog/streaming-llm-response-react) tutorial covers the implementation.

:::demo streaming-text/Default

Two more details matter:

- **Don't yank the scroll.** Follow new text only while the user is at the bottom. When they scroll up to reread, stop following and offer a jump-to-latest button.
- **Announce once.** Mark the streaming region `aria-busy` so screen readers read the finished answer rather than every fragment.

## Respect reduced motion

Loading states are almost all animation, so they're where `prefers-reduced-motion` matters most. Every {{brand.short}} loader, shimmer and caret respects it, and Streaming Text shows text immediately instead of revealing it gradually. If you build your own, keep the meaning without the motion: static dots, a status label, the same Stop button.

## What happens when it fails or times out?

Some waits end badly: the provider is down, the rate limit hits, the connection drops, the request times out. The loading state has to hand off to an error state cleanly.

- **Keep the user's message.** Never make someone retype a prompt because the request failed.
- **Say what happened and what to do.** "The model took too long to respond. Try again, or pick a faster model" beats "Error". A [Status Banner](/components/status-banner) ships copy for errors, rate limits, credits and offline.
- **Retry in place.** The same button that was Send and Stop becomes Retry.
- **Set timeouts per task type.** A chat reply and a research report have very different normal durations; one global timeout will be wrong for both.

## AI loading states checklist

1. Acknowledge the submit instantly — the message appears and the button changes state.
2. Show a loader in the reply slot, not a spinner in the corner.
3. Replace generic loaders with specific status text as soon as you know the step.
4. Show reasoning and tool calls, collapsed once the answer arrives.
5. Use skeletons only for content whose shape you know.
6. Stream at an even pace; show the caret only while text is arriving.
7. Stop is always visible and actually cancels the request.
8. Long tasks show phases, elapsed time and a way to leave.
9. Reduced motion keeps the meaning without the animation.
10. Failures keep the prompt and offer a one-click retry.

Loading states are where AI products feel fast or slow, and they're mostly a design problem. Start with [Loader](/components/loader), [Streaming Text](/components/streaming-text) and [Prompt Input](/components/prompt-input), then see how they fit a full chat in the [AI chat UI design guide](/blog/ai-chat-ui-design-guide).
