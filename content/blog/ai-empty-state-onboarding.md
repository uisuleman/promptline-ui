---
title: "The Empty State Is Your Best Onboarding Screen: AI Edition"
seoTitle: "AI Empty State Design: Your Best Onboarding Screen"
description: "AI empty state design that turns a blank chat into onboarding: starter prompts, capability hints, personalization, a setup wizard and a returning-user screen."
date: 2026-09-27
topic: ai-ux-patterns
tags: [empty state, onboarding, ai ux, suggestions, starter prompts]
coverTitle: The AI empty state is your onboarding
coverAlt: 'Cover image for "The Empty State Is Your Best Onboarding Screen: AI Edition", showing a chat home screen with a greeting, a prompt box and four starter prompt cards.'
components: [empty-state, suggestion, onboarding-wizard, knowledge-upload, prompt-input, announcement]
tldr:
  - An AI empty state is the first screen of a chat, and a blank one is the most expensive screen in your product because users don't know what to ask.
  - Say what the product does in one line, then give three or four starter prompts written as things a user would actually type.
  - Use starters to show capabilities — files, web search, code — instead of listing features.
  - Personalize for returning users with recent work and a greeting, and keep the prompt box front and center.
  - Use a short setup wizard only when the product needs data or context to be useful, and end it on a first prompt.
faq:
  - q: What should an AI chat empty state include?
    a: One short line on what the product is for, a prompt box, and three or four starter prompts. Optionally add a small announcement for something new and, for returning users, recent conversations.
  - q: How many suggested prompts should an AI empty state show?
    a: Three or four. Fewer doesn't show enough range; more turns into a menu people have to read instead of a shortcut they can click.
  - q: Should an AI product have an onboarding wizard?
    a: Only if it needs setup to be useful — a goal, connected data or uploaded documents. Keep it to three to five steps, make optional steps skippable, and finish on a first prompt so onboarding ends with a useful answer.
  - q: How should the empty state change for returning users?
    a: Shift from teaching to resuming. Greet them, keep the prompt box first, show recent conversations to pick up, and rotate or personalize starters based on what they've done before.
---

An AI empty state is the first screen people see in a chat product — and for new users, it *is* the onboarding. A blank text box asks people to guess what the product can do, and most guess small or leave. The fix is simple: one line on what the product is for, a prompt box, and three or four starter prompts that show the range of what's possible. This post covers how to design that screen for first-time and returning users, when to add a setup wizard, and what not to do.

## Why is a blank AI chat screen a problem?

Traditional software shows you its features: menus, buttons, tabs. A chat interface hides all of them behind a text box. The product might summarize contracts, write SQL and search the web, but the screen shows none of that.

So users face the blank-canvas problem. They don't know what to ask, so they ask something vague ("hi" or "what can you do?"), get a vague answer, and decide the product is vague. The first answer sets their expectations for every answer after it.

That makes the empty state the most expensive screen in an AI product. It's where people decide whether to try a second prompt. Treat it as an onboarding screen, not a placeholder.

## What makes a good AI empty state?

A good empty state does three jobs in about five seconds of attention:

1. **Says what the product is for** in one short line. Capabilities, not a mission statement. "Write, analyze files, search the web, or brainstorm" beats "Your AI-powered productivity companion".
2. **Gives one-click ways to start**, so nobody has to write the first prompt from scratch.
3. **Keeps the prompt box obvious**, for people who already know what they want.

Here's that screen with starter cards — each card has a short task and a second line of context:

:::demo empty-state/Default

The [Empty State](/components/empty-state) component handles the layout: an optional icon, a title, one line of description, and a slot for suggestions or a prompt box.

## How do you write good starter prompts?

Starter prompts, or suggestion cards, are the most useful thing on the screen. They remove the blank page in one click and quietly teach what the product can do. A few rules make them work.

**Write them as things a user would actually type.** "Summarize a PDF" is a task. "Document analysis" is a feature name. People recognize their own tasks; they have to translate feature names.

**Show three or four.** Fewer doesn't show enough range. More becomes a menu to read instead of a shortcut to click.

**Make them concrete.** "Plan a 3-day trip to Lisbon" teaches more than "Plan a trip", because it shows the level of detail the model handles well.

**Use cards on the empty state and chips for follow-ups.** Cards have room for a second line of context ("key points in five bullets"). Chips are compact enough to sit under an answer as next steps. On mobile, chips should scroll horizontally rather than wrap into a wall of pills.

The [Suggestion](/components/suggestion) component comes in both forms:

:::demo suggestion/Cards

Decide what a click does. For short, complete prompts, send immediately. For prompts that need the user's input ("Debug my code — paste an error"), fill the prompt box instead and let them add the details.

## How do you show what an AI product can do?

Use the starters to cover different capabilities, not four variations of the same one. If your product can read files, search the web, write code and generate images, give each its own card. One card per capability doubles as a feature tour nobody has to sit through.

A few other quiet ways to show capability:

- **Icons in the prompt box.** An attach button and a web-search toggle tell people files and search are available without a word of copy. The [Prompt Input](/components/prompt-input) has slots for both.
- **A small announcement.** When you ship something new, a pill above the title ("New: upload spreadsheets") informs without blocking. An [Announcement](/components/announcement) should never be a modal, and a dismissal should be remembered.
- **The placeholder text.** "Ask anything, or drop a file here" is one more hint for the people who skip everything else.

## How should you personalize the empty state?

Generic starters are fine for a first visit. After that, personalize with what you already know.

- **Greet by name** and adjust to time of day. "Good evening, Sam" makes the screen feel like a home rather than a form.
- **Tailor starters to their goal.** If they told you during setup that they work in customer support, show support tasks, not code.
- **Use their own data.** "Summarize the Q3 report you uploaded" is a much better starter than a generic one, because it proves the product knows their context.

Here's the home-screen style, with the prompt box inside the empty state and chips beneath it:

:::demo empty-state/WithPromptInput

## When do you need an onboarding wizard?

Most AI chat products don't need one — the empty state is enough. Add a setup wizard only when the product can't be useful without context: a goal that changes defaults, a workspace name, connected apps or uploaded documents.

If you do add one, keep it short and pointed at the first answer:

- **Three to five steps.** Every extra step loses people.
- **One decision per step.** "Pick your goal" is one step; "name your workspace" is another.
- **Make optional steps skippable** and let people go back.
- **End on a first prompt.** The goal of onboarding isn't a finished profile — it's the first useful answer.

The [Onboarding Wizard](/components/onboarding-wizard) follows this shape: goal → workspace → knowledge (optional) → first prompt, with a stepper, per-step validation and focus moving to each new step for screen-reader users.

### How should knowledge upload fit into onboarding?

If your assistant works from the user's documents, uploading them is the moment it becomes *their* assistant. Design that step carefully. Reject unsupported files up front with the exact reason ("MOV files aren't supported") rather than after upload. And show that indexing, not uploading, is the finish line — a "reading and indexing" state stops people asking questions before the files are ready.

[Knowledge Upload](/components/knowledge-upload) handles uploading → processing → ready, with retry for failed files. Once files are ready, the empty state can offer starters that reference them.

## What should returning users see?

The first-visit empty state teaches. The returning-user empty state should help people resume.

- **Prompt box first.** Returning users mostly know what they want. Don't make them scroll past tutorials.
- **Recent conversations** close by, in the sidebar or as a short list, so picking up yesterday's thread is one click.
- **Fewer or rotated starters.** Once someone has used a capability, stop teaching it. Rotate in things they haven't tried.
- **What's new, quietly.** One announcement pill at most.

The screen should feel lighter with every visit.

## What should you avoid in an AI empty state?

- **A logo and a blank box.** The most common version, and the most expensive.
- **A mission statement.** "Unlock the power of AI" tells people nothing about what to type.
- **Ten suggestions.** That's a menu, not a shortcut.
- **Feature names as starters.** "Code interpreter" is your word, not theirs.
- **A modal tour before the first prompt.** People skip it and then face the same blank box.
- **Starters that fail.** If a suggestion needs a file or a connection the user doesn't have, it will produce a bad first answer. Only show starters that work right now.
- **The same screen forever.** A returning user doesn't need the beginner tour on their fiftieth visit.

## AI empty state checklist

1. One line says what the product is for, in plain words.
2. Three or four starter prompts, written as real tasks, each covering a different capability.
3. The prompt box is visible and focused.
4. Clicking a starter either sends it or fills the box, whichever fits.
5. Returning users see recent work and personalized starters.
6. Any setup wizard is three to five steps and ends on a first prompt.
7. Uploaded knowledge shows when it's actually ready.

The empty state is one pattern among many — see the full set in [AI UX patterns every AI product needs](/blog/ai-ux-patterns), how it fits the rest of the interface in the [AI chat UI design guide](/blog/ai-chat-ui-design-guide), what to show once the user hits send in [AI loading states](/blog/ai-loading-states), and how to handle the moment free users run out in [usage limits and paywall UX](/blog/ai-usage-limits-paywall-ux). To build it, browse the free [AI components](/components) and start with Empty State and Suggestion.
