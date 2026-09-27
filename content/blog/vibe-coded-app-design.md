---
title: "Why Your Vibe-Coded App Looks Generic — and How to Fix It in an Afternoon"
seoTitle: "Vibe-Coded App Design: Fix the Generic Look Fast"
description: "Vibe coded app design looks generic for fixable reasons. An afternoon plan: tokens, type, spacing, radius, states and design rules for your AI tool."
date: 2026-09-27
weight: 60
topic: guides
tags: [vibe coding, design tokens, ui design, cursor, lovable]
coverTitle: Fix your vibe-coded app's design
coverAlt: 'Cover image for "Why Your Vibe-Coded App Looks Generic — and How to Fix It in an Afternoon", showing a plain default interface beside a polished version of the same screen.'
components: [button, empty-state, status-banner, skeleton, loader, prompt-input, message]
tldr:
  - Vibe-coded apps look generic because AI tools fall back to default tokens, random spacing, too many primary buttons and no loading, empty or error states.
  - Fix the foundation first — color tokens, one type scale and a 4px spacing grid — because every screen inherits it.
  - Allow one primary action per view; everything else is secondary or ghost.
  - Design the loading, empty and error states for every screen, not just the happy path.
  - Give your AI tool design rules — a component kit with written notes, a prompt that carries them, or the shadcn MCP server — so it stops reinventing the defaults.
faq:
  - q: Why do apps built with Cursor, Lovable or v0 all look the same?
    a: The tools start from the same defaults and nobody tells them otherwise. Without your own tokens, type scale and spacing rules, every generated screen falls back to the same colors, sizes and layouts.
  - q: Can I fix the design of a vibe-coded app without a designer?
    a: Yes. Most of the generic look comes from a handful of foundation problems — tokens, type, spacing, button hierarchy and missing states. You can fix those in an afternoon and then give your AI tool rules so new screens follow them.
  - q: What are design tokens and why do they matter?
    a: Design tokens are named values for color, type, spacing and radius, like a surface color or a muted text color. When every component uses tokens instead of raw values, you can change the whole look in one place and dark mode works automatically.
  - q: How do I stop my AI coding tool from undoing my design?
    a: Give it the rules along with the code. Paste a prompt that includes your tokens and design notes, or connect a component registry through the shadcn MCP server, and ask it to use the files exactly as provided.
---

Vibe coded app design looks generic for a short list of fixable reasons: default tokens, a random type scale, spacing that drifts, every button styled as primary, and no loading, empty or error states. The good news is that none of these need a redesign. You can fix the foundation in an afternoon, then give Cursor, Lovable, v0, Bolt or Claude Code the rules so every new screen follows them.

This guide covers the causes first, then a step-by-step afternoon plan.

## Why do vibe-coded apps look generic?

AI coding tools are very good at producing a screen that works. They are not good at producing a screen that belongs to *your* product, because nobody gave them the rules. So they fall back to the same defaults every time. Here are the six patterns that give it away.

### Default tokens everywhere

The same slate greys, the same blue or purple accent, the same gradient on the hero. When colors are hard-coded as raw values in each file, nothing is consistent and nothing is yours. It also means dark mode was never really designed — it's whatever the inverted greys happen to look like.

### No type scale

Look at any generated app and count the font sizes. You'll often find 13, 14, 15 and 16px sitting side by side with no clear reason, plus an arbitrary `text-[17px]` somewhere. Without a scale, hierarchy comes from bolding things, and the page feels noisy.

### Spacing that drifts

Padding of 12 on one card, 14 on the next, 20 on the third. Gaps between sections that change from screen to screen. Each value was reasonable when it was generated; together they make the interface feel slightly off in a way people notice but can't name.

### Every button is primary

Save, Cancel, Export, Share and Delete all in the same filled accent color. When everything is loud, nothing is. Users can't tell what the main action is, so they slow down.

### No states

Generated screens show the happy path: data loaded, request succeeded. Click before the data arrives and you get a blank panel. Hit an error and you get "Something went wrong" — or nothing. The first-run screen is empty. These missing states are where apps feel unfinished.

### A generic chat UI

If your product has AI in it, the chat is probably the most-used screen, and it's usually the most generic: two identical bubbles, a bare spinner, no stop button, auto-scroll that yanks you down while you read. Our [AI chat UI design guide](/blog/ai-chat-ui-design-guide) covers every part of a chat interface that needs more than the default.

## How do you fix a vibe-coded app's design in an afternoon?

Work in this order. Each step makes the next one easier, and the first three fix problems on every screen at once.

### Step 1: Define your color tokens (30 minutes)

Replace raw colors with a small set of named tokens. You need fewer than you think:

- **Surfaces:** background, a slightly raised surface, and borders.
- **Text:** primary, muted and subtle.
- **One accent** for primary actions.
- **Semantic colors:** success, warning, danger and info — used only when they carry meaning.

Then find-and-replace raw greys with token classes like `bg-surface`, `text-fg-muted` and `border-border`. Define a light and dark value for each token, and dark mode now works everywhere.

Two rules keep it calm. Red is for real errors only — a usage limit or an offline state is neutral, because the user did nothing wrong. And keep the interface mostly monochrome so the accent means something. The [Theme Builder](/docs/theme) lets you pick one accent, a radius and a font, then export the tokens as CSS.

### Step 2: Pick a type scale (20 minutes)

Choose one font for UI and one mono font for code and data. Then pick around eight to ten sizes, each with a fixed line height, and ban everything else — no `text-[13px]`.

Three weights are enough: regular for body text, medium for labels and buttons, semibold for titles only. If your app shows long AI answers, set that reading text one step larger than UI text (15/24 works well) so answers read like documents rather than interface. Numbers that change — counts, timers, prices — should use tabular figures so they don't jitter.

### Step 3: Fix spacing on a 4px grid (40 minutes)

Every padding, margin and gap should be a multiple of 4: 4, 8, 12, 16, 24, 32, 48. Tailwind's default spacing scale already works this way, so this step is mostly deleting odd values.

Then make spacing mean something. Tight spacing (4–8px) groups items that belong together, like a label and its input. Medium (16–24px) separates items in a list. Large (32–48px) separates sections. Once spacing encodes relationships, pages start to look organized without adding a single border.

### Step 4: Pick one radius (10 minutes)

Generated apps mix `rounded-md` buttons, `rounded-xl` cards and `rounded-full` inputs on the same screen. Pick one base radius, make it a token, and derive the rest from it: small elements like badges one step smaller, cards and dialogs one step larger. Pills are fine for tags and avatars, but decide where they're allowed and stop there. Consistent corners do more for a "designed" feel than any gradient.

### Step 5: One primary action per view (20 minutes)

Go screen by screen and ask: what is the one thing the user came here to do? That button gets the accent. Everything else becomes secondary (outlined or subtle) or ghost (text only). Destructive actions get their own treatment and, if they can't be undone, a confirmation.

The [Button](/components/button) component has five variants for exactly this hierarchy. Try it:

:::demo button/Default

If you find two actions competing for primary on the same screen, that's usually a sign the screen is doing two jobs.

### Step 6: Design the states (60 minutes)

This is the step that makes an app feel finished. For every screen that loads data or calls a model, design four states:

- **Loading.** Use [Skeleton](/components/skeleton) placeholders shaped like the real content for things you already know are coming — saved lists, history. Use a [Loader](/components/loader) with a status label ("Searching your docs…") when you're waiting on a model. They mean different things. Our guide to [AI loading states](/blog/ai-loading-states) goes deeper.
- **Empty.** Never ship a blank panel. Say what goes here and give one-click ways to start. For AI products, the [Empty State](/components/empty-state) is the best onboarding screen you have — see [the empty state is your best onboarding screen](/blog/ai-empty-state-onboarding).
- **Error.** Say what happened, why if it helps, and what to do next. A [Status Banner](/components/status-banner) handles rate limits, offline and out-of-credit states with the right tone for each.
- **Success.** Often just the content itself, or a small confirmation with undo.

Here's what a well-designed error and limit state looks like:

:::demo status-banner/Default

### Step 7: Replace placeholder copy (30 minutes)

Nothing says "template" faster than "Welcome to your dashboard" and "Lorem ipsum." Write the words your users will actually read:

- **Buttons say what happens.** "Send invite," not "Submit." "Delete 3 files," not "OK."
- **Confirmations name the stakes.** "Send email to 248 customers?" beats "Are you sure?"
- **Errors say what to do next.** "You've used today's 50 messages. They reset at midnight, or upgrade for more."
- **Empty states invite action.** "No projects yet. Import from GitHub or start from a template."

Real copy also exposes real layout problems — long names, big numbers, translated strings — that placeholder text hides.

### Step 8: Use a component kit with design rules (30 minutes)

Rebuilding a chat thread, a prompt box or a model picker from scratch is where most of the generic look creeps back in. Swap your hand-rolled versions for components that already handle the details — the stop button in the same spot as send, auto-scroll that stops when you scroll up, actions that stay visible on touch screens.

{{brand.name}} is free and MIT-licensed, installs with the shadcn CLI, and every component ships with written design notes explaining *why* it works the way it does. If your app has a chat, start with [Prompt Input](/components/prompt-input) and [Message](/components/message), or follow the [ChatGPT-style chat UI tutorial](/blog/chatgpt-style-chat-ui-nextjs) to assemble a full one in about 15 minutes. Still deciding which kit to use? Our [comparison of the best AI chat UI kits](/blog/best-ai-chat-ui-kits) covers ten options honestly, including when not to pick us.

### Step 9: Give your AI tool the design rules (20 minutes)

This is the step that keeps the fix from unravelling next week. Your AI tool will keep generating defaults unless the rules travel with the code. Three ways to do that:

- **Copy a prompt.** Every {{brand.short}} component page has an AI prompt tab containing the component, its dependencies, the tokens, the Tailwind preset and the design notes. Paste it into Lovable, Bolt, v0, Cursor or Claude.
- **Use the shadcn MCP server.** Once the registry is added to your `components.json`, Claude Code, Cursor or VS Code can search, read and install components themselves. Our [shadcn MCP server guide](/blog/shadcn-mcp-server-guide) walks through the setup.
- **Write a short rules file.** Keep a few lines in your project's instructions for the AI tool: use token classes only, sizes from the type scale only, spacing in multiples of 4, one primary button per view, every screen has loading, empty and error states.

When you paste an AI prompt, add one line of intent on top so the tool knows where it goes and what not to touch:

```text title="prompt.txt"
Add this Status Banner to the top of the chat page. Use the files, tokens and
design notes below exactly as provided. Don't restyle it or change the colors.
Show it when the API returns 429, with the copy "You've hit today's limit.
It resets at midnight."

[paste the AI prompt tab here]
```

If the tool still restyles a component, ask it to use the file exactly as provided.

## What should you check before calling it done?

Run this checklist on your three most-used screens:

1. No raw hex or grey values left in component files — only tokens.
2. Every font size comes from the scale; no arbitrary sizes.
3. Every spacing value is a multiple of 4, and every corner uses the radius token.
4. Each screen has exactly one primary button.
5. Each screen has a loading, empty and error state you've actually seen.
6. Errors say what to do next, only real errors are red, and no placeholder copy is left.
7. Dark mode has been checked by eye, not assumed.
8. The layout holds at 390px wide and works from the keyboard.
9. Your AI tool has the rules, so the next screen starts right.

None of this needs a designer or a rewrite — just an afternoon of saying no to defaults. When you're ready to replace the hand-rolled parts, browse the free [components](/components) and start with the screen your users see most.
