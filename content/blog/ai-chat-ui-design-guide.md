---
title: "AI Chat UI Design: The Complete 2026 Guide (With Free React Components)"
seoTitle: "AI Chat UI Design: The Complete 2026 Guide"
description: "AI chat UI design, section by section: prompt input, streaming, reasoning, citations, errors, history and mobile — with free React components for each part."
date: 2026-09-27
weight: 100
topic: guides
tags: [ai chat ui, chat ui design, ai ux, react, design guide]
coverTitle: The complete AI chat UI design guide
coverAlt: 'Cover image for "AI Chat UI Design: The Complete 2026 Guide (With Free React Components)", showing an annotated chat interface with a prompt box, a streamed answer, sources and actions.'
components: [prompt-input, message, streaming-text, reasoning, sources, actions, empty-state, status-banner]
tldr:
  - Good AI chat UI design is mostly about states — waiting, streaming, failing and hitting limits — not about the happy path.
  - Use one status value (ready, submitted, streaming, error) to drive the send button, the caret and the stop button together.
  - Put user messages in bubbles and assistant answers full-width, because AI answers are long and should read like documents.
  - Show the work — reasoning, tool steps and sources — collapsed by default and one click away.
  - Every error, limit and empty screen needs a next step in plain words, never "Something went wrong".
faq:
  - q: What makes a good AI chat UI?
    a: A good AI chat UI makes the wait feel productive, keeps the user in control and explains itself. In practice that means a clear request status, a stop button in the same spot as send, visible reasoning and sources, and errors that say what to do next.
  - q: Should AI chat messages use bubbles?
    a: Use bubbles for the user and full-width text for the assistant. User messages are short and conversational; AI answers are often long, with lists and code, and read far better at document width.
  - q: How do I show that the AI is thinking?
    a: Show something within about 300ms of submit — a loader or a status label like "Searching the web…". For models that reason, show the thinking while it streams, then collapse it to a short "Thought for 8s" label once the answer starts.
  - q: Do I need to build these chat components from scratch?
    a: No. {{brand.name}} is a free, MIT-licensed set of React and Tailwind components for AI products that you install with the shadcn CLI, so you own the code and can restyle it.
---

AI chat UI design is the craft of making a conversation with a model feel fast, trustworthy and under the user's control. A good chat interface does five things well: it makes asking easy, makes waiting feel productive, shows its work, handles failure honestly and stays readable as threads get long. This guide walks through every part of an AI chat interface — what good looks like, the mistakes that make products feel generic, and the free [{{brand.name}}](/components) component that handles each part.

If you only remember one thing: the happy path is the easy part. Waiting, failing, hitting limits and being unsure are where AI products win or lose trust.

## What are the parts of an AI chat interface?

A modern chat UI has fourteen moving parts. Most teams build four of them (input, messages, a spinner, a sidebar) and discover the rest in bug reports. Here's the full anatomy, top to bottom:

1. Prompt input
2. Message layout
3. Streaming
4. Reasoning and tool steps
5. Sources and citations
6. Actions and feedback
7. Empty state and suggestions
8. Errors and limits
9. Conversation history
10. Attachments
11. Model picker
12. Mobile layout
13. Accessibility
14. Dark mode

If you want to see them assembled before reading the theory, the [ChatGPT-style chat UI tutorial for Next.js](/blog/chatgpt-style-chat-ui-nextjs) builds a working version in about 15 minutes. If you're still choosing a starting point, see our comparison of the [best AI chat UI kits](/blog/best-ai-chat-ui-kits).

## How should the prompt input work?

The prompt box is the most-used control in the product, so small details compound.

**What good looks like.** The textarea grows as you type, up to about ten lines, then scrolls — beyond that a bigger editor hides the conversation you're replying to. Enter sends and Shift+Enter adds a line. Most importantly, one button has four states: send, sending, stop and retry. Stop replaces send in the same spot, because people reach for it in a hurry and their cursor is already there.

**Common mistakes.**
- A separate stop button somewhere else on screen.
- Enter-to-send that fires mid-composition for Japanese, Chinese or Korean input methods.
- A character counter that's always visible. Show it only near the limit.
- Disabling the whole input while the model answers, so people can't draft their next message.

**Component:** [Prompt Input](/components/prompt-input) drives all of this from a single `status` prop: `ready → submitted → streaming → ready`, or `error`. Try the states:

:::demo prompt-input/Statuses

For power users, add a "/" command menu and "@" context picker — see [slash commands and @mentions in React](/blog/slash-commands-mentions-react) for the full pattern.

## How should AI chat messages be laid out?

**What good looks like.** Asymmetry. User messages sit in a soft bubble capped at around 80% width; assistant messages run full-width with no bubble. Bubbles signal "short and conversational". Full width signals "read this". AI answers often include headings, lists and code, so they deserve the document treatment. Keep the reading column around 768px and set body text a step larger than UI text.

Inside an assistant turn, keep a predictable order: process (reasoning, tools) → answer → actions (copy, retry, feedback). When every message follows the same order, people learn where to look.

**Common mistakes.** Two identical bubbles left and right, as in a messaging app. Answers crammed into 60%-wide bubbles with code blocks that scroll sideways. Metadata and buttons scattered around each message.

**Component:** [Message](/components/message) has `header` and `footer` slots for exactly this order, and Conversation handles the scroll container.

## How do you design streaming responses?

Streaming is the difference between "this is slow" and "this is working".

**What good looks like.** Show something within about 300ms of submit — a silent screen for one second feels broken, while five seconds with a clear loader feels fine. Once tokens arrive, reveal them at an even pace. Models send text in bursts, so rendering each burst as it lands looks jittery; a steady reveal reads like typing. Show a caret only while text is still coming.

Scrolling matters as much as rendering. Follow new text while the user is at the bottom, and stop the moment they scroll up to reread. Then offer a "jump to latest" button.

**Common mistakes.** Yanking readers back down while they read — the most common chat UX bug. Re-parsing the whole markdown string on every token. A caret left blinking on a finished answer.

**Component:** [Streaming Text](/components/streaming-text) smooths bursts and speeds up when it falls behind:

:::demo streaming-text/Default

The engineering side — chunk handling, markdown parsing and render performance — is covered in [how to render streaming LLM responses in React without jank](/blog/streaming-llm-response-react). For the gap before the first token, see [AI loading states that don't feel slow](/blog/ai-loading-states).

## How do you show AI reasoning and tool steps?

**What good looks like.** Visible thinking builds trust during a wait. Once the answer arrives, it becomes noise. So show reasoning while it streams, then collapse it to a single line like "Thought for 8s". Style it quieter than the answer — smaller, muted, with a left rule — so it never reads as the response.

For tool calls, lead with a human title ("Searched the web") and keep the function name as secondary detail. Successful steps stay collapsed; errors and approval requests open automatically because they need attention.

**Common mistakes.** Dumping raw JSON tool results into the thread. Reasoning that stays expanded forever and pushes the answer off screen. A bare spinner for a 40-second agent run.

**Components:** [Reasoning](/components/reasoning) for free-form thinking, Chain of Thought for distinct steps, and Tool for individual calls:

:::demo reasoning/Default

The wider set of patterns — plans, approvals, background runs — lives in our pillar on [AI UX patterns every AI product needs](/blog/ai-ux-patterns).

## How should sources and citations look?

**What good looks like.** Put the citation right after the claim it supports, and show the domain, not a bare number — a domain means something, while "[3]" makes people hunt. Below the answer, a collapsed "Used 4 sources" pill with favicons expands into numbered source cards. Sources support the answer; they shouldn't push it down the page.

**Common mistakes.** A wall of links at the end with no connection to specific claims. Citations bunched at the end of paragraphs. Hover previews that don't work from the keyboard.

**Components:** [Sources](/components/sources) and Inline Citation. The full reasoning is in [designing AI citations users actually trust](/blog/ai-citations-ui).

## Which actions belong under an AI response?

**What good looks like.** Copy, regenerate, thumbs up/down, and optionally read aloud and share. Copy confirms with an icon swap for two seconds — no toast needed. In long threads, reveal actions on hover to keep things calm, but always show them on touch screens where hover doesn't exist. Every icon button gets a tooltip and an aria-label.

A thumbs-down should open a short list of specific reasons — "Didn't follow instructions" is something your team can fix; "Bad" is not. And regenerating should never destroy the previous answer: keep versions one click away with a small "2 / 3" pager.

**Components:** [Actions](/components/actions), Feedback Dialog and Branch.

## What should an AI chat empty state show?

**What good looks like.** A blank chat is the most expensive screen in an AI product, because users don't know what to ask. Say what the product is for in one short line, then give three or four starters written as things a user would actually type ("Summarize a PDF", not "Document analysis").

**Common mistakes.** A logo and an empty text box. Ten suggestion chips that read like a menu. Starters that describe features instead of tasks.

**Components:** [Empty State](/components/empty-state) plus Suggestion chips or cards. We go deeper in [the empty state is your best onboarding screen](/blog/ai-empty-state-onboarding).

## How do you design AI errors and usage limits?

**What good looks like.** Every message follows one formula: what happened → why (if useful) → what to do. Rate limits show a live countdown and keep retry disabled until it's allowed. Reassure where you can — "Your message is saved" turns a failure into a pause. Only real errors use red; limits and policy blocks are neutral, because the user did nothing wrong.

For paid products, show remaining credits before people hit the wall, and always say when the limit resets. A limit with a reset time is a pause; without one it's a wall.

**Common mistakes.** "Something went wrong." A red banner for a free-plan limit. Losing the user's typed message on failure. A paywall with no free way out.

**Components:** [Status Banner](/components/status-banner), Usage Meter and Upgrade Dialog. Read more in [usage limits, credits and paywalls for AI products](/blog/ai-usage-limits-paywall-ux).

## How should conversation history work?

**What good looks like.** Group chats by date — Today, Yesterday, Previous 7 days — because that's how people remember them. Pin the few threads people return to daily. Keep search always visible; history is useless if you can't find things in it. While saved threads load, show skeletons shaped like the real content.

**Components:** [Chat Sidebar](/components/chat-sidebar) and Skeleton.

## How should file attachments behave?

**What good looks like.** Files appear as fixed-size chips with progress shown on the icon, so the row never reflows. Images show as thumbnails because people recognize pictures faster than filenames. Failed uploads stay in place with a retry button — silently dropping a file is how users lose work. Accept drag-and-drop and paste.

**Component:** Attachments, which slots straight into the prompt input.

## How should a model picker be designed?

**What good looks like.** Describe what each model is good for ("Deeper reasoning for complex work"), not benchmark scores. Keep locked models visible with a lock icon — hiding them hides the reason to upgrade. Add search only past six or so models. Because the picker lives in the composer at the bottom of the screen, open it upward.

**Component:** [Model Selector](/components/model-selector).

## What changes for mobile chat UI?

Most of the rules above hold; the details shift.

- Actions are always visible, because there's no hover.
- Suggestion chips scroll horizontally instead of wrapping into a wall of pills.
- The history sidebar becomes a drawer — a Sheet works well.
- Keep the composer pinned to the bottom and make sure the on-screen keyboard doesn't cover the send button.
- Test at 390px wide. If code blocks or tables break the layout there, they'll break for real users.

## How do you make an AI chat UI accessible?

- Give the thread `role="log"` with polite live-region semantics so screen readers hear new messages without being interrupted.
- Mark the streaming answer `aria-busy` until it's done, so the full answer is announced once instead of word by word.
- Every icon-only button needs an aria-label.
- Hover cards (citations, context) must open on focus too.
- Respect `prefers-reduced-motion` for loaders, carets and shimmer.
- Walk the whole flow with the keyboard: type, send, stop, copy, open history, switch model.

{{brand.short}} components ship with these built in; the job is not to remove them when you customize.

## How do you handle dark mode in a chat UI?

**What good looks like.** Build on tokens, not raw colors. Surfaces, text and borders use semantic names like `bg-surface` and `text-fg-muted`, and a single `dark` class swaps the values. Code blocks use syntax tokens too, so highlighting follows the theme. Keep one accent color and use color only when it carries meaning.

**Common mistakes.** Hard-coded greys that turn invisible on dark backgrounds, pure black surfaces with pure white text, and status colors that were only checked in light mode. See [colors](/docs/colors) and the [theme builder](/docs/theme) for the token set.

## Can AI coding tools build a good chat UI for me?

Yes, if you give them the rules. Left alone, tools like Cursor, Lovable, v0 and Claude Code tend to produce the same default chat: centered bubbles, a bare spinner, no error states. That's why so many products look alike — we unpack the causes in [why your vibe-coded app looks generic](/blog/vibe-coded-app-design).

Two fixes. Every {{brand.short}} component page has an AI prompt tab that bundles the code with its design notes. And the shadcn MCP server lets Claude or Cursor search and install components directly — the setup is in our [shadcn MCP server guide](/blog/shadcn-mcp-server-guide) and on the [AI tools](/docs/ai-tools) page.

## AI chat UI design checklist

Run this before you ship:

1. The send button has four states, and stop sits where send was.
2. Something appears within 300ms of submit.
3. Streaming is smooth, and auto-scroll stops when the user scrolls up.
4. Reasoning and tool steps collapse once the answer starts.
5. Claims link to sources, next to the claim.
6. Copy, regenerate and feedback sit under every answer, visible on touch.
7. The empty state explains the product in one line and offers 3–4 starters.
8. Every error and limit says what happened and what to do next.
9. History is grouped by date and searchable.
10. Failed uploads keep the file with a retry.
11. The model picker describes models in plain language.
12. The layout works at 390px, from the keyboard, and in dark mode.

That's the full anatomy of an AI chat interface. Every part above has a free, copy-paste component — start with Prompt Input and browse the rest in [all components](/components).
