---
title: "Usage Limits, Credits and Paywalls: UX for Paid AI Products"
seoTitle: "AI Usage Limits UX: Credits, Quotas and Paywalls"
description: AI usage limits UX done right — meters that warn early, neutral limit messages with countdowns, locked models and upgrade dialogs that don't feel hostile.
date: 2026-09-27
topic: ai-ux-patterns
tags: [usage limits, paywall, pricing ux, credits, rate limits]
coverTitle: Usage limits that don't feel like a wall
coverAlt: 'Cover image for "Usage Limits, Credits and Paywalls: UX for Paid AI Products", showing a usage meter, a rate-limit banner with a countdown and an upgrade dialog.'
components: [usage-meter, status-banner, upgrade-dialog, model-selector, usage-chart, api-key-input, context]
tldr:
  - Show usage before it runs out — a meter that stays neutral until 80%, turns amber at 80% and red at 95%, always with a reset time.
  - Treat rate limits, quotas and out-of-credits as three different messages, each with its own next step and a neutral tone, because the user did nothing wrong.
  - Never cut off a response mid-generation because of a limit; finish or save the answer, then block the next request.
  - Keep locked premium models visible in the model picker and route a click on them to an upgrade dialog that explains why the user is seeing it.
  - Every paywall needs a free way out — "or come back tomorrow" — and bring-your-own-key users need a masked, verifiable key field.
faq:
  - q: How should an AI app tell users they've hit a usage limit?
    a: Say what happened, when it resets and what they can do now — for example "You've used today's 50 messages. They reset at midnight UTC. Upgrade for more, or come back tomorrow." Use a neutral color, not red, because hitting a limit isn't an error.
  - q: What's the difference between a rate limit and a quota in UX terms?
    a: A rate limit is a short pause — too many requests too fast — and should show a countdown until retry is allowed. A quota is a budget for a period — a day, a month — and should show a reset date plus an upgrade option.
  - q: Should I use credits or a subscription for my AI product?
    a: From a UX angle, subscriptions are easier to understand and credits are fairer when tasks vary a lot in cost. If you use credits, show what a typical action costs before people run it, so the balance never drains by surprise.
  - q: Should locked AI models be hidden from free users?
    a: No. Keep them in the model picker with a lock icon and a plain description of what they're good for. Hiding them hides the reason to upgrade; showing them sets expectations honestly.
---

Good AI usage limits UX comes down to three rules: show usage before it runs out, explain limits in neutral, specific words with a clear next step, and put the upgrade in the context of what the user was trying to do. Every paid AI product has limits, but the limit is rarely what annoys people — the surprise is. Below: meters, limit messages, countdowns, locked models, upgrade dialogs and bring-your-own-key, with live components.

It's one pattern from the bigger set in [AI UX patterns every product needs](/blog/ai-ux-patterns).

## How do you show usage before it runs out?

A limit someone can see coming is a budget; one that appears out of nowhere is a wall. So start with a visible meter where users already look — the sidebar footer, the account menu, or above the prompt box when they're close.

The [Usage Meter](/components/usage-meter) does three things worth copying:

- **It's calm by default.** The bar stays neutral until 80% used, turns amber at 80% and red at 95%. A meter that's always colorful trains people to ignore it.
- **It always says when it resets.** "Resets in 4 days" turns a limit into a pause. Without a reset time, people assume the worst.
- **It shows the real numbers.** "38 / 50 messages" beats a vague percentage, because people plan in units they understand.

:::demo usage-meter/Default

### Pick the unit users think in

Meter what users can reason about, not what your bill is based on. Messages, images or research runs are easy to budget. Raw tokens are fine for developer tools; for everyone else, convert them into something human.

### Warn at thresholds, not constantly

Show a quiet meter all the time and add one extra nudge at the thresholds that matter — for example an inline meter next to the composer past 80%. That's when people can still switch to a cheaper model, finish the important task first, or upgrade on their own terms.

### The context window is a limit too

Users also hit the model's context window without knowing it, and answers can get worse as it fills. A small [Context](/components/context) ring in the prompt toolbar shows how full it is, turns amber at 80%, and suggests a new chat before quality drops. Its hover card can add a token breakdown and cost for developer tools.

## Rate limit, quota or out of credits: which message do you show?

These three states often get lumped together as "limit reached", but each needs a different next step.

| State | What happened | What to show | Next step |
|---|---|---|---|
| Rate limit | Too many requests too quickly | "Slow down a little" + a countdown | Retry, enabled when the countdown ends |
| Quota | The period's allowance is used up | What was used + when it resets | Wait for the reset, or upgrade |
| Out of credits | The prepaid balance is empty | Balance at zero + how to top up | Buy credits or upgrade |

The [Status Banner](/components/status-banner) has a preset for each of these, and the copy formula is the same every time: **what happened → why (if useful) → what to do**. "Something went wrong" is never acceptable for a limit — you know exactly what went wrong.

### Keep the tone neutral

Hitting a limit isn't an error, and the user did nothing wrong. So no red, no error icon, no scolding copy — save red for real failures like a dropped connection. A rate limit can use a mild warning tone; quotas and out-of-credits should look like ordinary information.

Reassure where you can: "Your message is saved" turns a blocker into a pause.

### Use a real countdown for rate limits

When a rate limit is short, don't make people guess when to try again. Show a live countdown and disable the retry button until it reaches zero. If your API returns a [`Retry-After` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) with its [429 response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429), use that value instead of a hard-coded guess.

:::demo status-banner/Default

The Status Banner takes a `countdown` in seconds, ticks it down, and enables the action at zero — so the button is never clickable when clicking it would just fail again.

## What happens if the limit hits mid-generation?

An answer that stops halfway because the budget ran out is the worst version of this. Avoid it:

- **Check before you start.** If a request would exceed the remaining quota, say so before sending, not after 30 seconds of streaming.
- **Finish what you started.** If the limit hits during a response, let that response complete and block the *next* one. The cost of a few extra tokens is smaller than the cost of a user who feels cheated.
- **If you must stop, keep the partial answer.** Mark it clearly as incomplete, keep it copyable, and offer to continue after the reset or upgrade.
- **Never lose the prompt.** Whatever happens, the text the user typed stays in the box or in the thread.

For agent or research tasks that run for minutes, estimate the cost and show it before the user starts. The same principle — be honest about progress and never throw away work — runs through [AI loading states that don't feel slow](/blog/ai-loading-states).

## How should locked premium models work?

It's tempting to hide paid models from free users. Don't — hiding a model hides the reason to upgrade and makes the product look smaller than it is.

The [Model Selector](/components/model-selector) keeps locked models in the list with a lock icon and a muted name. Clicking one doesn't select it; it calls `onLockedSelect`, which is where you open your upgrade dialog. A few details make this feel fair:

- **Describe what each model is good for**, not its benchmark scores. "Deeper reasoning for complex work" tells someone why they'd pay; a leaderboard number doesn't.
- **Remember the intent.** A locked click shouldn't reset their current model — and if they upgrade, select the one they wanted.

## What makes a good upgrade dialog?

A paywall people meet in the middle of a task should answer one question: why am I seeing this, and what's the fastest way to keep going? The [Upgrade Dialog](/components/upgrade-dialog) is built around that.

- **Lead with the reason.** "You've used today's free messages" or "This model is on the Pro plan" — the title and description should name the exact wall they hit.
- **Show plans in context.** Put the thing they were blocked on at the top of the recommended plan's features. If they clicked a locked model, the first feature listed is that model.
- **Mark one plan as recommended.** Two equal choices slow people down. The dialog highlights one plan and labels the current plan so nobody buys what they already have.
- **Always offer the free way out.** "Or come back tomorrow" — a paywall with no exit feels hostile, and people remember that.

:::demo upgrade-dialog/Default

Focus is trapped inside the dialog and restored on close; Esc and the backdrop both dismiss it. And only open it in response to something the user did — a paywall that pops up on page load reads as a sales tactic, not help.

## Credits vs subscriptions: what's the UX difference?

This is a pricing decision, but it changes the interface a lot. From a UX angle only:

**Subscriptions with an allowance** are the easiest to understand: people know what they pay, and the meter answers "how much is left this month?" Heavy users may hit the cap mid-month, so the reset date must be visible.

**Credits** are fairer when tasks vary widely in cost — a quick answer versus a 20-minute research run. The UX burden is higher: people can't budget credits unless they know what things cost. So:

- Show the cost of an action **before** it runs, next to the button ("Uses about 10 credits").
- Show the balance change **after** it runs, so the connection between action and cost is obvious.
- Warn at a low balance, not only at zero.

**Hybrids** — a subscription that includes credits, plus top-ups — should show one balance, not two. And whatever you choose, apply it everywhere; a product where some features spend credits and others count messages makes users learn two systems.

## Show usage history in settings

The meter answers "how much is left?" The billing or settings page should answer "where did it go?" A [Usage Chart](/components/usage-chart) with daily bars does that:

- **Lead with the total** for the selected range — that's the number people came for.
- **Draw the daily limit** as a labeled dashed line, and color only the over-limit days differently.
- **Keep bars on a zero baseline** so heights are honest.
- **Offer 7- and 30-day ranges.** Most questions are about this week or this billing period.

## How do you design API key entry for bring-your-own-key?

Developer tools and open-source apps often let users bring their own provider key instead of paying you for usage. The key field is small, but it's where many first sessions fail.

The [API Key Input](/components/api-key-input) handles the details:

- **Masked by default**, with show/hide. Keys get screenshotted and screen-shared more than people expect.
- **Whitespace is trimmed on input.** A stray space from copy-paste is a very common cause of "invalid key".
- **A Verify button with clear states**: checking, valid, invalid.
- **Helpful error copy.** "That key didn't work. Check it's copied in full and has access to this model" beats "Invalid key".
- **Confirm with the last four characters** once it's saved — "Connected · key ending in 7f3a" — never the full key.

BYOK users still hit their provider's limits. Map those to the same neutral banner states and say whose limit it is, so they know where to fix it.

## A checklist for AI usage limits UX

1. Show a usage meter before users need it, with real numbers and a reset time.
2. Stay neutral until 80%; warn at 80% and 95%, not before.
3. Use separate messages for rate limits, quotas and out-of-credits — each with its own next step.
4. Never use red or error language for a limit. Save red for real failures.
5. Show a live countdown on rate limits and disable retry until it's allowed.
6. Don't cut off a response mid-generation — finish it, or keep the partial answer.
7. Keep locked models visible and route them to a paywall that names the reason and offers a free way out.
8. For credits, show the cost of an action before it runs.

Limits start before someone even sends their first message — the first screen is a good place to set expectations, as covered in [the empty state as your best onboarding screen](/blog/ai-empty-state-onboarding). For how these states fit into a full chat product, see the [AI chat UI design guide](/blog/ai-chat-ui-design-guide).

Every component in this post is free, open source and installable with the shadcn CLI — copy them from the pages linked above, or browse all [AI components](/components).
