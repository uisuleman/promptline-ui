---
title: "AI UX Patterns: 20 Interface Patterns Every AI Product Needs"
seoTitle: "AI UX Patterns: 20 Patterns Every AI Product Needs"
description: "20 AI UX patterns for input, output, trust, agents and product states — what each one is for, when to use it, one design rule and a free React component."
date: 2026-09-27
weight: 80
topic: ai-ux-patterns
tags: [ai ux, design patterns, ai agents, trust, product design]
coverTitle: 20 AI UX patterns every product needs
coverAlt: 'Cover image for the guide "AI UX Patterns: 20 Interface Patterns Every AI Product Needs", showing a prompt box, a reasoning panel, a citation pill and an approval card.'
components: [prompt-input, loader, streaming-text, reasoning, inline-citation, plan, confirmation, status-banner]
tldr:
  - Almost every AI product needs the same 20 interface patterns, grouped into input, output, trust, agents and product states.
  - Waiting is a design surface — acknowledge a request instantly, say what the model is doing, stream evenly and always offer Stop.
  - Trust comes from things people can check, like a source pill right after a claim, confidence you can actually measure and memory users can edit.
  - Agents need three moments of control — a question before expensive work, a plan before running and an approval before anything hard to undo.
  - Empty screens, errors and usage limits are product states, not edge cases; each one needs plain copy and exactly one clear next step.
faq:
  - q: What are AI UX patterns?
    a: They are reusable interface solutions to problems that show up in nearly every AI product — waiting on a model, showing where an answer came from, approving an agent's action or explaining a usage limit. They sit on top of classic UX patterns and handle what is new about AI output, which is slow, variable and sometimes wrong.
  - q: Which AI UX patterns should I build first?
    a: For a first release, build the composer with request states, a waiting state, smooth streaming, an empty state with starter prompts and clear error states. Add citations when you answer factual questions, usage patterns when you charge, and agent patterns as soon as the AI takes actions.
  - q: Do AI UX patterns only apply to chatbots?
    a: No. Many of them work outside chat — inline rewriting in a document, a plan card in a project tool, an approval step in a workflow builder. The same principles apply everywhere, such as showing progress, making output reviewable and keeping undo close.
  - q: How do I make users trust AI output?
    a: Give them evidence instead of asking for faith. Put sources next to the claims they support, show confidence only when your system can estimate it, and ask for approval before consequential actions. A generic "AI can make mistakes" line on its own does very little.
---

AI UX patterns are the interface solutions nearly every AI product ends up needing: a way to wait on a slow model, show where an answer came from, let an agent ask before it acts, and handle limits and errors without a dead end. This guide collects 20 of them in five groups — input, output, trust, agents and product states. For each one you get what it is, when to use it, one design rule, and a free component from [{{brand.name}}](/components) that already implements it.

If you're building a chat product specifically, read this alongside the [AI chat UI design guide](/blog/ai-chat-ui-design-guide), which puts many of these patterns into one screen.

## Why do AI products need their own UX patterns?

Classic interface patterns assume software is fast, predictable and correct. AI breaks all three:

- **It's slow.** A reply takes seconds; an agent run can take minutes.
- **It's variable.** The same prompt gives a different answer next time.
- **It's sometimes wrong.** A confident, well-formatted answer can still be made up.

Every pattern below exists to handle one of those facts. Slowness calls for waiting states and progress. Variability calls for regenerate, versions and review. Being wrong calls for sources, confidence and approvals.

## Input patterns

### 1. A composer that shows every request state

**What it is:** the prompt box, with one button that changes meaning as the request moves along — send, sending, stop, retry. It grows with the text and accepts files.

**When to use it:** always. It's the front door of any chat or agent product, and it's where people look while they wait.

**Design rule:** put Stop exactly where Send was. People reach for it in a hurry, and their cursor is already there. See [Prompt Input](/components/prompt-input).

Switch between the states in this demo to see the button change:

:::demo prompt-input/Statuses

### 2. Context people can see

**What it is:** attached files, mentioned docs and selected sources shown as chips above the prompt, each with its own uploading, ready and error state.

**When to use it:** whenever your product can read files, docs, repos or other people's work — anything that changes what the model receives.

**Design rule:** a failed upload stays in place with a retry button. Silently dropping a file is how people lose trust in the answer that follows. See [Attachments](/components/attachments).

### 3. Slash commands and @mentions

**What it is:** a "/" menu for common actions (summarize, translate, rewrite) and an "@" picker for pulling in files, people or tools — both inside the prompt box.

**When to use it:** once you have repeat users and a handful of actions they run every day. The build is covered in [slash commands and @mentions in React](/blog/slash-commands-mentions-react).

**Design rule:** only open the slash menu when "/" is the first character. A slash mid-sentence is just a slash. See [Slash Commands](/components/slash-commands).

### 4. Model choice in plain language

**What it is:** a model picker that says what each model is good for — "Fast answers for everyday tasks", "Deeper reasoning for complex work" — rather than listing version numbers.

**When to use it:** only when models really differ in speed, cost or quality in ways your users care about. Many products are better off picking for them.

**Design rule:** keep locked models visible with a lock icon. Hiding them hides the reason to upgrade. See [Model Selector](/components/model-selector).

## Output patterns

### 5. A waiting state that appears instantly

**What it is:** feedback in the reply slot the moment someone presses Enter — dots at first, then a status line like "Searching the web…" once you know what the model is doing.

**When to use it:** on every model call. The gap before the first token is where AI products feel broken. The full playbook is in [how to design AI loading states](/blog/ai-loading-states).

**Design rule:** prefer a status label over a bare spinner. It says the wait is productive, not just happening. See [Loader](/components/loader).

### 6. Smooth streaming

**What it is:** text revealed at an even pace, even though the model sends it in bursts, with a caret only while text is still arriving.

**When to use it:** for any answer longer than a sentence. The code is in [rendering streaming LLM responses in React](/blog/streaming-llm-response-react).

**Design rule:** remove the caret the instant the answer is done. A blinking caret on a finished answer looks stuck. See [Streaming Text](/components/streaming-text).

### 7. Visible reasoning that gets out of the way

**What it is:** the model's thinking shown in a quiet panel while it works, which collapses to a single "Thought for 8s" line once the answer starts.

**When to use it:** when your model exposes reasoning or meaningful intermediate steps.

**Design rule:** style reasoning quieter than the answer — smaller, muted, with a left rule — so it never reads as the response. See [Reasoning](/components/reasoning).

:::demo reasoning/Default

### 8. Regenerate without losing the old answer

**What it is:** copy, retry and feedback actions under each response, with every version kept behind a small "2 / 3" pager.

**When to use it:** when answers are subjective — writing, ideas, images — or when people might want to compare.

**Design rule:** regenerating never destroys anything. If it wipes the previous answer, people stop experimenting. See [Branch](/components/branch).

## Trust patterns

### 9. Citations next to the claim

**What it is:** a small pill with the source's domain placed right after the sentence it supports, with a preview on hover or focus.

**When to use it:** whenever answers draw on search, documents or a knowledge base. The deep dive is [designing AI citations users actually trust](/blog/ai-citations-ui).

**Design rule:** show the domain, not a bare number. A name like "nngroup.com" means something; "[3]" makes people hunt. See [Inline Citation](/components/inline-citation).

Hover the pill in this demo to open the preview:

:::demo inline-citation/Default

### 10. Honest confidence

**What it is:** a confidence label on an answer, or a highlight on the specific part that's uncertain, so people know what to double-check.

**When to use it:** only when your system can actually estimate confidence — for example from retrieval agreement or a verification step — or the domain is high-stakes.

**Design rule:** never show confidence you can't measure. Decorative certainty destroys trust faster than none. See [Confidence](/components/confidence).

### 11. Memory people can see and edit

**What it is:** a quiet "Memory updated" chip when the assistant saves something, plus one place to review, edit, delete or switch memory off.

**When to use it:** when your product keeps preferences or facts between sessions.

**Design rule:** every memory is visible and deletable. Memory users can't see feels like surveillance; memory they can edit feels like a feature. See [Memory](/components/memory).

### 12. AI edits you can review

**What it is:** AI help inside the thing people are working on — select text, ask for a rewrite, see the change before it lands.

**When to use it:** whenever the AI edits a document, form or codebase rather than answering in a chat.

**Design rule:** show a diff before applying anything. Changes are reviewable, never silent. See [Inline AI](/components/inline-ai).

## Agent patterns

Agents take actions, run for minutes and touch real systems. The design question shifts from "how do I show the answer?" to "how do I show the work and keep people in control?" [Agentic UX design](/blog/agentic-ux-design) covers this group in depth.

### 13. Tool calls as readable steps

**What it is:** one compact row per tool call — "Searched the web", "Read pricing.md" — with a status and duration. Parameters and raw results sit one click deeper.

**When to use it:** whenever your model uses tools and people benefit from seeing what happened.

**Design rule:** quiet when it works, loud when it matters. Successful calls stay collapsed; errors and approval requests open automatically. See [Tool](/components/tool).

### 14. A clarifying question before expensive work

**What it is:** a short question with two to four concrete answers, a "Something else…" option and a way to skip.

**When to use it:** when the request is ambiguous and the work is slow or costly. A five-second question beats five minutes in the wrong direction.

**Design rule:** always leave an escape. Never trap people inside your options. See [Clarifying Question](/components/clarifying-question).

### 15. Plan, then run

**What it is:** the agent proposes its steps before acting. People can edit or run the plan, and the same card becomes the progress view.

**When to use it:** for tasks with several steps, tasks that take more than a minute, or tasks that touch several systems.

**Design rule:** one card for both phases, so the plan people approved is the plan they watch. See [Plan](/components/plan).

### 16. Approval before consequential actions

**What it is:** before an agent sends, pays, deletes or publishes, it stops and asks — with the key facts listed and Deny as easy as Approve. [Human-in-the-loop UX](/blog/human-in-the-loop-ux) covers when to ask and how to avoid approval fatigue.

**When to use it:** for actions that are hard to undo or affect other people.

**Design rule:** say exactly what will happen: "Send email to 248 customers?", never "Run tool?". See [Confirmation](/components/confirmation).

:::demo confirmation/Default

### 17. Progress for long-running work

**What it is:** a view for tasks that take minutes — the current phase, the sources being read, elapsed time and a Stop button — plus a place to come back to later. [Deep research UI](/blog/deep-research-ui) walks through the full pattern.

**When to use it:** when a task runs longer than people will sit and watch.

**Design rule:** show the current step, not a guessed percentage. "Reading 14 of 20 sources" is believable; a bar stuck at 62% isn't. See [Research Progress](/components/research-progress) and [Agent Runs](/components/agent-runs).

## Product-state patterns

### 18. An empty state that teaches

**What it is:** the first screen of a new chat — one line on what the product is for and three or four starter prompts. More in [the empty state as your best onboarding screen](/blog/ai-empty-state-onboarding).

**When to use it:** always. It's the first screen every new user sees, and a blank box makes them guess.

**Design rule:** write starters the way people type ("Summarize this PDF"), not as feature names ("Document analysis"). See [Empty State](/components/empty-state).

### 19. Errors that say what to do next

**What it is:** a distinct message for each failure — dropped connection, provider outage, rate limit, content policy, offline — each with an action.

**When to use it:** before launch, not after the first angry email. These failures are guaranteed.

**Design rule:** never write "Something went wrong". Say what happened, why if it helps, and what to do — and keep the user's message so nobody retypes a prompt. See [Status Banner](/components/status-banner).

### 20. Usage people can see coming

**What it is:** a small meter for credits or messages left, a clear reset time, and a paywall that explains why it appeared. [Usage limits and paywall UX](/blog/ai-usage-limits-paywall-ux) covers the details.

**When to use it:** whenever you have a free tier, credits or rate limits.

**Design rule:** always say when the limit resets. A limit with a reset time is a pause; without one, it's a wall. See [Usage Meter](/components/usage-meter).

## The rules behind all 20 patterns

If you only keep a few ideas from this list, keep these:

1. **Respond instantly, even if the answer isn't ready.** A status line beats silence.
2. **Stop is always one click away** — in the composer, on long tasks and on agent runs.
3. **Nothing is destroyed by regenerating or editing.** Keep versions, show diffs, offer undo.
4. **Evidence sits next to claims.** Sources, confidence and tool steps appear where the question comes up.
5. **Ask before anything hard to reverse**, and say exactly what will happen.
6. **Every failure has a next step.** No dead ends.
7. **Make the invisible visible** — context, memory, usage and progress.

## Which AI UX patterns should you build first?

It depends on what your product does. A rough order:

| If your product… | Start with |
|---|---|
| Is a chat assistant | 1, 5, 6, 18, 19 |
| Answers factual questions | add 9 and 10 |
| Charges for usage | add 20 |
| Edits documents or code | add 12 |
| Takes actions or runs long tasks | add 13–17 |

Patterns 1, 5, 6, 18 and 19 are the minimum for something that feels finished. Everything else follows from what your AI actually does.

You don't need to design each one from scratch. Every pattern here maps to a component you can install with the shadcn CLI — the [installation guide](/docs/installation) takes a couple of minutes. Then go deeper where your product needs it: [loading states](/blog/ai-loading-states), [citations](/blog/ai-citations-ui), [approvals](/blog/human-in-the-loop-ux) or [agentic UX](/blog/agentic-ux-design).
