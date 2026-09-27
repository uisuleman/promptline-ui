---
title: "Agentic UX: How to Show What an AI Agent Is Doing"
seoTitle: "Agentic UX: Showing What an AI Agent Is Doing"
description: Agentic UX patterns that build trust — plans, task lists, tool calls, diffs, approvals, a stop button and background runs, with free React components.
date: 2026-09-27
topic: ai-ux-patterns
tags: [agentic ux, ai agents, tool calls, human in the loop, trust]
coverTitle: Show what your agent is doing
coverAlt: 'Cover image for "Agentic UX: How to Show What an AI Agent Is Doing", showing an agent plan with progress, a collapsed tool call and a code diff awaiting review.'
components: [plan, tool, reasoning, queue, agent-runs, diff-view, confirmation, chain-of-thought]
tldr:
  - Good agentic UX makes minutes of invisible work legible — show the plan first, then turn the same card into the progress view.
  - Collapse successful tool calls to one line and open them automatically on errors or approval requests, the only moments that need attention.
  - Show changes as reviewable diffs with per-hunk accept and reject, plus a file tree that marks what the agent touched.
  - Ask for approval only before consequential actions, and say exactly what will happen and to whom.
  - Always offer Stop, let people keep typing while the agent works, and give long runs a home they can leave and come back to.
faq:
  - q: What is agentic UX?
    a: Agentic UX is the design of interfaces for AI that takes multi-step actions on its own — searching, editing files, calling APIs. Its main job is making that work visible and controllable, so users can follow progress, catch mistakes early and stop the agent when needed.
  - q: Should I show every tool call an AI agent makes?
    a: Show every call, but collapse successful ones to a single line with a human title like "Searched the web". Expand calls automatically only when they fail or need approval, and let anyone open the rest to see parameters and results.
  - q: When should an AI agent ask for permission?
    a: Before actions that are hard to undo or affect other people — sending messages, spending money, deleting data, writing to production. Reading and drafting rarely need approval; asking too often trains people to click Approve without reading.
  - q: How do I let users stop an AI agent?
    a: Keep a visible Stop button for as long as the agent is running, in the thread and in any background run list. Stopping should keep the work done so far and record where the agent stopped, so users can resume or retry.
---

Agentic UX is about one problem: an AI agent does minutes of work the user can't see, and people don't trust what they can't see. The fix is to make that work legible — a plan before acting, a live view of each step and tool call, reviewable changes, approvals before anything risky, and a Stop button that's always within reach. This post walks through each pattern with live components you can copy.

Agents are the newest and hardest group of [AI UX patterns](/blog/ai-ux-patterns). A chat reply takes seconds; an agent run can take minutes and touch real systems. That shifts the design question from "how do I show text arriving?" to "how do I show work happening?"

## Why agents need a different UX

A chat answer is one output you can read and judge. An agent run is a sequence of decisions, each of which could go wrong: it picks a file, runs a search, calls an API, edits code. If the interface shows only a spinner and then a result, users can't tell a good run from a lucky one.

Three things matter more for agents than for chat:

- **Direction.** Catching a wrong turn at step one saves minutes of wasted work.
- **Evidence.** People want to see what the agent read and touched, not only what it concluded.
- **Control.** The ability to redirect, approve or stop is what makes handing over work feel safe.

Every pattern below serves one of those.

## Show the plan before the agent acts

The cheapest place to fix an agent's mistake is before it starts. For any task longer than a few seconds, have the agent propose a plan first — a short list of steps — and let the user run it, edit it or change direction.

The [Plan](/components/plan) component uses one card for both phases. Before running, it shows the steps with **Edit plan** and **Run plan** buttons. Once any step starts, the buttons disappear and the same card becomes the progress view: the active step is highlighted, and finished steps are struck through and muted so the eye jumps straight to what's happening now.

:::demo plan/Default

Using one card matters. If the plan disappears and a separate progress view appears, users lose their place. Keeping the same list means the thing they approved is the thing they're watching.

### Keep a running to-do list

Plans change as agents learn more. When the agent discovers extra work, add it to a visible to-do list instead of silently doing more than was agreed. The [Queue](/components/queue) component shows the agent's to-dos with a count in the header ("2/4"), so progress is readable even when the list is collapsed.

## Show each step, not just a spinner

Once the agent is running, the question becomes "what is it doing right now?" There are three levels of detail, and most products need all three.

### Tasks: what the agent is working on

A [Task](/components/task) is a collapsible unit of work — "Found the auth logic" — with the concrete files, queries and links it touched listed underneath as monospace chips. Name tasks by outcome rather than action. "Found the auth logic" reads as progress; "Searching…" reads as waiting.

### Tool calls: what the agent actually did

Every search, file read or API call is a tool call, and each deserves a row. The [Tool](/components/tool) component leads with a human title ("Searched the web") and keeps the function name as secondary detail for developers. It has six states: pending, running, needs approval, completed, error and denied.

The key behavior is what opens by default:

- **Successful calls stay collapsed.** One line with a check and a duration. Ten successful searches shouldn't push the answer off the screen.
- **Errors open automatically** and show the error text.
- **Approval requests open automatically**, because they're waiting on the user.

:::demo tool/AllStates

That rule — quiet when things work, loud when they need attention — is the core of agentic UX. Where users will read a result, pass custom UI (a chart, a weather card, a table) instead of raw JSON.

### Reasoning: why the agent chose what it did

For models that expose their thinking, show it — but quietly. [Reasoning](/components/reasoning) opens while the model is thinking, then collapses to "Thought for 8s" when the answer starts. The duration tells users the model worked hard; the collapse keeps the thinking from being mistaken for the answer.

When the steps are distinct and meaningful — searched, read three pages, compared prices — use [Chain of Thought](/components/chain-of-thought) instead. It's a timeline where each step can carry its results, pending steps are shown faded, and the collapsed label shows the active step, so users see progress without expanding anything.

For the moments before any of this appears — the first few seconds of silence — see [AI loading states that don't feel slow](/blog/ai-loading-states).

## Show changes as diffs, not summaries

When an agent edits files, "I updated the login page" isn't enough. Users need to see exactly what changed, and they need to be able to keep some of it.

The first question after an agent touches code is "what did it touch?" A [File Tree](/components/file-tree) answers that at a glance with A, M and D markers for added, modified and deleted files. Collapsed folders roll up their changes, so users can find the work without expanding everything. The markers use letters plus color — never color alone.

Then comes review. The [Diff View](/components/diff-view) lets users accept or reject each hunk, or everything at once. Decided hunks collapse to a one-line summary with Undo, so what still needs review is obvious, and every decision stays reversible until the user moves on.

:::demo diff-view/Default

Per-hunk review reflects how agents actually perform: right most of the time, not all of the time. An all-or-nothing Apply button forces people to either accept a mistake or throw away good work.

The same idea applies beyond code. If an agent rewrites a document, updates a spreadsheet or edits CRM records, show a before-and-after with a way to reject individual changes.

## Ask for approval before consequential actions

Some actions shouldn't happen without a human saying yes: sending an email, spending money, deleting data, writing to production. For those, pause and ask.

The [Confirmation](/components/confirmation) card follows a few rules:

- **Say exactly what will happen and to whom.** "Send email to 248 customers", not "Run tool?".
- **Show the key facts** — recipients, amount, target — as a short list people can check.
- **Make Deny as easy as Approve.** Both buttons sit together; neither is hidden.
- **Flag high-risk actions** with an amber border — enough to slow people down without alarming them.
- **Record the outcome**, so the thread keeps an audit trail of what was approved.

An optional "Always allow" lets users stop being asked about a tool they trust. Use it for low-risk tools only.

Don't ask for everything. If every file read needs approval, people start clicking Approve without reading, and the one approval that matters gets the same treatment. The full approach — what to gate, how to word it, how to batch approvals — is in [human-in-the-loop UX for AI agents](/blog/human-in-the-loop-ux).

## Let users interrupt, redirect and stop

Control is what makes delegation feel safe. Three patterns give users that control.

**Stop is always visible.** While the agent runs, a Stop button sits where the send button was, and in every list of running jobs. Stopping should keep the work done so far and say where it stopped. A stop that throws everything away teaches people not to press it — and then they wait out runs they know are wrong.

**People can keep typing.** Agents run for minutes, and users think of corrections while they watch. Don't block the composer. The Queue component holds messages typed while the agent was busy; each can be sent now or removed, so the user decides what runs next.

**Redirect without starting over.** A queued message like "use the v2 API instead" should reach the agent at its next step, not wait for the whole run to finish.

## Give long runs a home

Some agent tasks take long enough that nobody should sit and watch. Coding agents, research agents and data jobs often run in the background. Users need a place to see what's running, what finished and what failed — and to leave and come back.

[Agent Runs](/components/agent-runs) is that place. Each run shows its status (queued, running, completed, failed or stopped), duration, optional cost, and for running jobs, the current step and progress. Show the step, not just a percentage — "Reading page 13 of 20" builds more trust than a bar at 62%.

Failures should say why and what to do — "reconnect HubSpot" — right next to a Retry button. Stopped and failed runs both get Retry, and running ones get Stop.

### Notify people when the work is done

If users can leave, they need to know when to come back. Use an in-app toast when they're elsewhere in the product, a badge on the runs list, and — with permission — a browser notification via the [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) or an email for long jobs. Say what finished and link straight to the result. The same pattern matters for long research tasks, covered in [deep research UI](/blog/deep-research-ui).

## Trust and control: the rules of agentic UX

1. **Plan first.** Show the plan and let users edit it before minutes of work begin.
2. **One card, two phases.** The plan becomes the progress view.
3. **Quiet when working, loud when it matters.** Collapse successful tool calls; open errors and approvals.
4. **Name outcomes, not actions.** "Found the auth logic" beats "Searching…".
5. **Show evidence.** Files touched, sources read and tool inputs are one click away.
6. **Review changes as diffs** with per-hunk accept, reject and undo.
7. **Gate only consequential actions**, and say exactly what will happen.
8. **Stop is always visible** and keeps partial work.
9. **Never block the composer** while the agent runs.
10. **Give background runs a home** and notify people when they finish.

Agentic UX isn't about showing everything — it's about showing the right thing at the right moment. Every component here is free and open source; start with the Plan and Tool components linked above, or browse all [AI components](/components).
