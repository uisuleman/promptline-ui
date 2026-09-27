---
title: Designing AI Citations Users Actually Trust
seoTitle: "AI Citations UI: Design Sources Users Trust"
description: "Design an AI citations UI people actually check: inline citations vs source lists, hover previews, showing what was read, confidence, broken links and mobile."
date: 2026-09-27
topic: ai-ux-patterns
tags: [citations, sources, trust, ai ux, rag]
coverTitle: AI citations users actually trust
coverAlt: 'Cover image for "Designing AI Citations Users Actually Trust", showing an AI answer with a domain pill after a sentence and a hover card previewing the source.'
components: [inline-citation, sources, hover-card, confidence, research-progress]
tldr:
  - Put citations immediately after the claim they support, as a domain pill with a preview on hover and focus — not as a bare number at the end of the paragraph.
  - Use inline citations to support specific claims and a collapsed source list to show everything that was consulted; most answers with sources need both.
  - Show what the model actually read, and never cite a source it only found in search results but didn't open.
  - Pair citations with honest confidence signals, and highlight the specific uncertain phrase rather than stamping a warning on every answer.
  - Plan for broken and unverifiable sources, and make previews work on touch screens, where hover doesn't exist.
faq:
  - q: What is the best way to show citations in an AI answer?
    a: Place a small pill with the source's domain right after the sentence it supports, and show a preview card on hover and keyboard focus. Add a collapsed "Used N sources" list below the answer so people can see everything that was consulted.
  - q: Should AI citations be numbers or links?
    a: Domains work better than bare numbers. "nngroup.com" tells people something before they click; "[3]" makes them scroll to a footnote to find out. Keep numbers only as a way to connect inline pills to the source list.
  - q: Do citations stop AI hallucinations?
    a: No. A model can cite a real page and still misstate what it says. Citations make answers checkable, which is the point — so link to the specific page, show a snippet of what was used, and make checking fast.
  - q: How do I show citations on mobile?
    a: Hover doesn't exist on touch screens, so a tap on the citation should open the preview, with the link to the source inside it. Keep pills short, let them wrap with the text, and make the tap target large enough to hit.
---

An AI citations UI has one job: make it fast for people to check where a claim came from. That means putting the source right next to the claim, showing a preview without leaving the page, and being honest about what the model actually read. Citations that sit in a footer as bare numbers look rigorous but rarely get checked.

This post is part of the [AI UX patterns](/blog/ai-ux-patterns) series. It covers the choices that decide whether people use your citations or scroll past them.

## Why AI answers need citations

Language models can produce answers that sound right and aren't. Nielsen Norman Group [defines a hallucination](https://www.nngroup.com/articles/ai-hallucinations/) as output that "seems plausible but is incorrect or nonsensical" — and plausible is exactly the problem, because nothing in a fluent answer looks wrong.

Citations don't fix that. They make it checkable. The same NN/g article notes that presenting sources "in a drill-down format (such as links, cards, or a list of references at the end of the chat output) can encourage users to check the answer." Your job is to make that check take seconds, not minutes.

## Inline citations vs a source list

These do different jobs, and most answers with sources need both.

### Inline citations support specific claims

An [Inline Citation](/components/inline-citation) sits immediately after the sentence it supports. It shows the domain — "nngroup.com", not "[3]" — because a name tells people something before they click. When a claim has several sources, the pill shows the first domain with a "+2", and the preview pages through them.

Place it right after the claim, not at the end of the paragraph. A paragraph with four claims and one citation at the end leaves people guessing which claim it supports.

:::demo inline-citation/Default

### A source list shows everything consulted

[Sources](/components/sources) is a collapsed "Used 4 sources" pill with favicons that expands into numbered source cards. It answers a different question: "What did this answer draw on overall?"

Keep it collapsed and below the answer. Sources support the answer; they shouldn't push it down the page. Number the cards so inline citations and the list can refer to each other.

:::demo sources/Expanded

### When to use which

- **Factual claims, numbers, quotes, dates:** inline citation on each.
- **Broad summaries built from many pages:** source list, with inline citations on the specific claims.
- **Answers from a single document the user uploaded:** a quote or page reference beats a web-style pill.

## Hover previews that make checking fast

The fastest check is one that doesn't leave the page. A preview card on hover shows the page title, domain and a short description or snippet, with a link out.

Three details make previews work:

- **An open delay.** A short delay stops cards flashing as the mouse crosses a paragraph. {{brand.short}}'s [Hover Card](/components/hover-card) waits 400ms by default and stays open while the pointer is over the card.
- **Keyboard focus.** The citation preview opens on focus too, so keyboard users get the same check.
- **Previews are extras, never the only copy.** The link and the source list must work without the hover.

Show a snippet of the passage the model actually used when you have it. A page title proves the page exists; a snippet proves it says what the answer claims.

## Show what the model actually read

Search results and read sources aren't the same thing. A model might see twenty results and open four. If you cite all twenty, you're claiming evidence you don't have.

- **Cite only what was opened and used.** Keep "found in search" and "read" separate in your data.
- **Link to the specific page**, not the site's home page. A citation to a domain root can't be checked.
- **Show the count honestly.** NN/g notes that details like "the number of supporting resources" help users judge whether a statement is widely supported or backed by only one or two references.

For long research tasks, show reading as it happens. [Research Progress](/components/research-progress) lists the sources being read right now, marking each as reading or read, with a live count and "+ N more" for the rest. By the time the report arrives, people have already seen where it came from. [Deep research UI](/blog/deep-research-ui) covers this pattern in full.

## Pair citations with honest confidence

A citation says where a claim came from. It doesn't say how sure the system is. Sometimes you need both.

[Confidence](/components/confidence) offers three tools:

- **A confidence badge** — high, medium or low — at the top of a result or next to a claim.
- **Uncertain text** that highlights the specific phrase the model is unsure about, with the reason on hover.
- **A verify note** for answers where a mistake has real consequences.

:::demo confidence/InAnAnswer

Only show confidence your system can actually estimate — for example, whether several retrieved sources agree. Fake certainty is worse than none. And be sparing with warnings: the NN/g article warns that a generic warning shown all the time turns into background clutter that people stop noticing. A verify note belongs on medical, legal, financial and numeric answers, not on every message.

## When not to cite

Citations everywhere become noise, the same way warnings do. Skip them when:

- **The content is the user's own.** Rewriting their paragraph doesn't need a source.
- **The answer is creative or generated** — a poem, a name idea, a draft email.
- **The claim is common knowledge** in context. Citing that water boils at 100°C at sea level adds clutter, not trust.
- **You didn't use a source.** Never attach citations after the fact to make an answer from the model's own knowledge look sourced. If there's no source, say so.

## Handle broken and unverifiable sources

Links rot, pages move and some sources sit behind logins. Plan for it:

- **Check links before showing them** when you can, and mark ones that failed rather than hiding the claim.
- **Say when a source is private** — "From your Google Drive" or "Requires sign-in" — so people don't think the link is broken.
- **Keep a snapshot** of the passage you used. If the page changes, the quote still explains the answer.
- **Never invent a URL.** If the model produced a link you can't match to a page it actually retrieved, drop the citation and flag the claim as unsourced.

When an agent is about to act on sourced information — sending a summary to a client, say — the same principle applies at a larger scale. [Human-in-the-loop UX](/blog/human-in-the-loop-ux) covers how to let people review before anything leaves the product.

## Citations on mobile

Hover doesn't exist on phones, so design the touch path first:

- **Tap opens the preview**, with the outbound link inside it. Don't make the first tap leave the page.
- **Keep pills short.** A domain and "+2" fits in a line of text; a full title doesn't.
- **Give the tap target room.** Small pills in dense text are hard to hit; add padding rather than enlarging the visible pill.
- **The source list matters more on mobile.** It's easier to tap through a list of cards than to hunt for tiny pills in a paragraph.

## AI citations UI checklist

1. Cite right after the claim, not at the end of the paragraph.
2. Show the domain, not a bare number.
3. Preview on hover and focus, with a snippet of the passage used.
4. Add a collapsed source list below the answer, numbered to match.
5. Cite only sources the model actually read.
6. Link to specific pages, never a home page.
7. Use confidence signals only when you can estimate them.
8. Skip citations for creative, personal and common-knowledge content.
9. Handle broken, private and unverifiable sources explicitly.
10. Design the tap path on mobile first.

Good citations turn "trust me" into "check me". Start with [Inline Citation](/components/inline-citation) and [Sources](/components/sources), or browse all the [AI components](/components) to add confidence signals and research progress.
