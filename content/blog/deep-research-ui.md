---
title: "Deep Research UI: Making Long AI Tasks Feel Fast"
seoTitle: "Deep Research UI: Making Long AI Tasks Feel Fast"
description: Deep research UI patterns for AI tasks that run for minutes — visible phases, a live source feed, elapsed time, a Stop button and a cited report.
date: 2026-09-27
topic: ai-ux-patterns
tags: [deep research, ai agents, progress, citations, long tasks]
coverTitle: Make long AI tasks feel fast
coverAlt: 'Cover image for "Deep Research UI: Making Long AI Tasks Feel Fast", showing a research progress card with phases, a live list of sources and an elapsed timer.'
components: [research-progress, clarifying-question, sources, inline-citation, toast, agent-runs, artifact]
tldr:
  - A deep research UI has to prove progress for minutes at a time — show the phases, the sources being read right now, a live count and elapsed time.
  - Ask one clarifying question with concrete options before starting, because a wrong assumption costs minutes, not seconds.
  - Always show a Stop button, and keep the partial results when someone uses it.
  - Let people leave and come back — run the task in the background, list it with other runs and notify them when the report is ready.
  - Deliver the report beside the chat with inline citations that show the domain, so every claim can be checked.
faq:
  - q: What is a deep research UI?
    a: It's the interface for an AI task that searches and reads many sources over several minutes, then writes a report. It shows the plan's phases, the sources being read, elapsed time and a Stop button while it runs, then presents a cited report.
  - q: How do you make a long AI task feel faster?
    a: Show proof of work. A list of sources that keeps growing, a named current phase and a running clock make waiting feel productive. Letting people leave and get notified when it's done removes the wait altogether.
  - q: Should a deep research tool ask questions before starting?
    a: Yes, when the request is ambiguous. One short question with a few concrete options takes seconds and prevents a multi-minute run in the wrong direction. Always include a way to skip and let the AI decide.
  - q: What should happen when a research task is stopped or fails?
    a: Keep whatever was found. Show the sources already read and offer the partial report, then give a clear way to retry or continue. Throwing away minutes of work makes people afraid to press Stop.
---

A deep research UI has one job: make several minutes of AI work feel productive instead of slow. That means showing proof of progress the whole time — the phase the agent is in, the sources it's reading right now, a live count and elapsed time — plus a Stop button, a way to leave and come back, and a finished report with citations people can check. This post covers each piece, with live components you can copy.

Deep research is one of the [AI UX patterns](/blog/ai-ux-patterns) where interface design changes how the product is judged. The same report feels thorough after a visible, well-paced run and suspicious after a silent five-minute spinner.

## Why long AI tasks need visible progress

A chat answer starts streaming in a second or two. A research task might read dozens of pages before writing a word. For all that time, the only thing the user can judge is what the interface shows them.

A spinner says "something is happening". It doesn't say whether it's working, how far along it is, or whether it's stuck. After a minute of spinner, people start to doubt it; after three, they reload the page. The fix isn't a faster model — it's better evidence. For the general version of this problem, see [AI loading states that don't feel slow](/blog/ai-loading-states).

## Clarify the question before you start

The most expensive research run is the one that answers the wrong question. "Research CRM tools for my startup" could mean pricing, integrations, or which one fits a five-person sales team. Guessing costs minutes.

So when a request is ambiguous and the work is expensive, ask first. The [Clarifying Question](/components/clarifying-question) card shows a short question with a few concrete answers, one of which can be marked as recommended:

:::demo clarifying-question/Default

A few details make it quick rather than annoying:

- **Offer options, not an open text box.** Choosing is faster than writing. Number keys 1–9 pick an option instantly.
- **Always leave an escape.** "Something else…" takes a custom answer, and Skip lets the agent decide.
- **Ask once.** One question, maybe two. A questionnaire before every run defeats the point of delegating.

After answering, the card shrinks to a one-line record of the choice, so the thread stays readable and the decision stays visible.

## Show phases, sources, time and a Stop button

Once the run starts, the [Research Progress](/components/research-progress) view carries the whole experience. It combines four signals that each answer a different worry:

- **Phases** answer "where is it?" A short checklist — plan, search, read, write — with the active phase marked and finished ones checked.
- **A live source feed** answers "is it actually working?" The sources being read right now, with favicons and domains, newest first.
- **A count and elapsed time** answer "how much has it done, and for how long?"
- **A Stop button** answers "can I get out?"

:::demo research-progress/Default

### Why the source feed matters most

A growing list of real sources is the strongest proof of work you can show. Users recognize domains they trust, see that the agent is reading more than one site, and can spot early if it's gone off course — reading forum posts when they wanted official docs.

Cap the visible list. Research Progress shows the five most recent sources by default, then "+ 29 more". The number says "thorough" without turning the view into a wall of links. Anyone curious can expand it.

### Show elapsed time, not a fake ETA

Research runs vary too much to predict well, and a countdown that keeps slipping destroys trust. Show elapsed time instead ("2m 14s") — it's always true. The component leaves the clock to you, so you can use the server's start time and keep it accurate across reloads.

### Stop keeps what was found

A visible Stop button makes people more willing to wait, because they know they can leave. But stopping should never throw work away. When a run is stopped, the view switches to "Research stopped" and still offers **Open report**, so users get whatever was gathered so far.

When the run finishes, the view collapses to a one-line summary with the report one click away. The details are still there under "Show details" for anyone who wants to audit the run.

## Let people leave and come back

The best way to make a long wait feel fast is to not make people wait at all. A research run that takes several minutes should keep going if the user switches tabs, opens another chat or closes the laptop.

That needs three things:

1. **Run it on the server.** The task can't depend on the browser tab staying open.
2. **Give runs a home.** [Agent Runs](/components/agent-runs) lists running, completed, failed and stopped jobs with their current step, duration and Stop or Retry actions. It's where people check on work they started earlier.
3. **Tell them when it's done.** A [Toast](/components/toast) works when they're elsewhere in your app — "Your report on CRM tools is ready" with an Open action. For longer runs, ask permission for a browser notification or send an email with a link straight to the report.

The same background pattern applies to any long agent job, not just research. It's covered in more depth in [agentic UX design](/blog/agentic-ux-design).

## Deliver the report with citations

The report is the product. Everything before it is there so people trust it when it arrives.

### Put the report beside the chat

A research report is long, structured and meant to be reused. It doesn't belong inside a chat bubble. The [Artifact](/components/artifact) panel shows it beside the conversation with a title, a version badge and copy, download and expand actions. The chat stays readable for follow-ups ("go deeper on pricing"), and each revision gets a new version so people know they're looking at the latest.

### Cite every claim, inline

A report built from 40 sources is only useful if people can check the claims that matter to them. Put an [Inline Citation](/components/inline-citation) right after the claim it supports — not at the end of the paragraph — and show the domain rather than a bare number. A domain means something; "[3]" makes people hunt.

:::demo inline-citation/Default

Hover or focus opens a preview of the source, and multiple sources for one claim page with arrows. At the end of the report, a [Sources](/components/sources) list collapses to "Used 42 sources" with favicons and expands into numbered cards. For the full approach — placement, previews, and what to do when sources disagree — see [designing AI citations users actually trust](/blog/ai-citations-ui).

## Handle failures and partial results

Long runs fail more often than short ones: a site blocks the crawler, a connector expires, a model call times out. Plan for it.

- **Keep partial results.** If the run fails after reading 25 sources, those sources and any draft are still valuable. Show them.
- **Say what failed and what to do.** "Couldn't reach your Google Drive — reconnect it and retry" beats "Research failed". Agent Runs shows the failure reason inline next to Retry.
- **Retry from where it stopped** when you can, rather than starting the whole run again.
- **Be honest about gaps.** If whole sections of the question couldn't be answered, the report should say so instead of filling them with guesses.

## A checklist for deep research UI

1. Ask one clarifying question when the request is ambiguous.
2. Show phases, a live source feed, a count and elapsed time.
3. Show elapsed time, not a guessed ETA.
4. Keep Stop visible, and keep partial results when it's used.
5. Run on the server and let people leave.
6. List runs in one place and notify people when a report is ready.
7. Put the report beside the chat, with inline citations on every claim.
8. On failure, keep what was found and say exactly how to recover.

Long tasks will only get longer as agents take on more work — the interface is what makes them feel worth the wait. Every component here is free and open source; browse all [AI components](/components) to build your own deep research view.
