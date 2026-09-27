---
title: "Slash Commands and @Mentions: Building a Power-User Prompt Input"
seoTitle: "Slash Commands in React: A Power-User Prompt Input"
description: Add slash commands and @mentions to a React prompt input — the UX rules that make them feel right, plus a tested example with keyboard navigation and chips.
date: 2026-09-27
topic: tutorials
tags: [react, slash commands, mentions, prompt input, keyboard]
coverTitle: Slash commands and @mentions
coverAlt: 'Cover image for "Slash Commands and @Mentions: Building a Power-User Prompt Input", showing a prompt box with an open command menu above it and a file chip attached.'
components: [slash-commands, mention-picker, prompt-input, command-bar, kbd]
tldr:
  - Open the "/" menu only when the slash is the first character of the message; open the "@" menu after any space or at the start.
  - Arrow keys move, Enter or Tab picks, and Esc closes the menu without deleting what the user typed.
  - Rank label matches above description matches, and show each command's id so people learn to type it directly.
  - Turn picked mentions into removable chips instead of leaving "@file" in the text, so the user sees exactly what context the model gets.
  - With {{brand.name}}, SlashCommands and MentionPicker wrap PromptInput through render props, and you chain their key handlers through the onKeyDown prop.
faq:
  - q: How do I add slash commands to a React text input?
    a: Watch the input value, open a menu when it matches a "/" at the start, and filter commands by the text after the slash. Handle arrow keys, Enter and Esc on the input itself so focus never leaves it. The Slash Commands component packages this as a render prop around any input.
  - q: Should slash commands work in the middle of a message?
    a: No. A slash mid-sentence is usually just a slash — "and/or", a path, a date. Only trigger the menu when the slash is the first character. Mentions are different, since people add context wherever it fits in the sentence.
  - q: What should Esc do in a command menu?
    a: Close the menu and keep the text. The user may really want to send "/", and throwing away what they typed punishes them for exploring.
  - q: Can slash commands and @mentions share one prompt input?
    a: Yes. Nest the two pickers and chain their key handlers — the slash menu handles the key first, and if it didn't use it, the mention menu gets a turn. Only one menu is ever open, because their triggers can't match at the same time.
---

Slash commands in React come down to three things: open a menu when the prompt starts with "/", keep focus in the input while arrow keys move through the list, and run the command without leaving stray text behind. Add "@" mentions that turn into chips, and you have the prompt input power users expect from modern AI tools and editors.

This tutorial covers the UX rules first, then builds a complete composer with the [Slash Commands](/components/slash-commands), [Mention Picker](/components/mention-picker) and [Prompt Input](/components/prompt-input) components from {{brand.name}}. The code was type-checked on Next.js 16, React 19 and Tailwind CSS v4.

Try it here: type "/" at the start of the box, then use the arrow keys.

:::demo slash-commands/Default

## Why do power users want slash commands?

A chat box is flexible, but it hides what the product can do. New users find features through [starter suggestions and the empty state](/blog/ai-empty-state-onboarding). By the tenth session, people want speed: they know they want a summary or a translation, and they don't want to phrase it as a paragraph or reach for the mouse.

Slash commands give them a keyboard-only path to every action. Mentions solve the other half — context. Typing "@roadmap" to attach a file is faster and more precise than uploading it again or hoping the model remembers.

Both also make intent explicit. "/translate" is an instruction your backend can route, not a guess the model has to make from free text.

## UX rules for slash commands and mentions

These rules separate a menu that helps from one that gets in the way. Get them wrong and the feature feels broken, even if the code works.

### Trigger "/" only at the start

A slash in the middle of a message is almost always just a slash: "and/or", "src/app", "9/27". Opening a menu there interrupts people mid-sentence. Only open the command menu when "/" is the first character of the prompt.

### Trigger "@" anywhere, after a space

Mentions are different. People write "compare @pricing.csv with last quarter" — the context goes where it fits in the sentence. Open the mention menu after "@" at the start or after a space, but not inside an email address like "maya@company.com".

### Keyboard first

Focus never leaves the textarea. Up and down move the highlight, Enter or Tab picks, and the mouse is optional. Crucially, Enter must pick from the menu while it's open and send the message when it's closed — never both.

### Esc closes and keeps the text

Esc should close the menu and leave "/sum" exactly where it was. The user might want to send a literal slash, or might just be looking. Clearing their input punishes exploring.

### Rank matches sensibly

When someone types "/tr", Translate should come first — not a command that merely mentions "tracking" in its description. Rank matches on the label and id first, then keywords, then the description. Keywords let "/img" find "Generate image".

### Show the command id

Show "/summarize" on the right of each row. After a few uses, people type the whole thing from memory and never wait for the menu. The menu teaches its own shortcut.

### Mentions become chips

When someone picks a file, remove "@road" from the text and show a chip above the input instead. The user can see exactly what context the model will get and remove it with one click. Leaving "@roadmap-q4.md" in the prose makes the message harder to read and harder to parse. Also hide items that are already attached.

Here's the mention picker on its own. Type "@" and pick something:

:::demo mention-picker/Default

## Step 1: Install the components

You'll need the {{brand.short}} registry in `components.json` and the theme installed. If you haven't done that yet, the [ChatGPT-style chat UI tutorial](/blog/chatgpt-style-chat-ui-nextjs) walks through both in a few minutes. Then add the three components:

```bash
npx shadcn@latest add @{{brand.slug}}/prompt-input @{{brand.slug}}/slash-commands @{{brand.slug}}/mention-picker
```

They land in `components/ai/`. Each one is a client component, so they work in the App Router as is.

## Step 2: How the pieces fit together

Both pickers wrap your input instead of replacing it. They take the same `value` and `onValueChange` as the input, render their menu above it, and give you an `onKeyDown` handler through a render prop:

- **SlashCommands** takes `commands` and calls `onRun` with the chosen command. It clears the "/query" text first.
- **MentionPicker** takes `items`, calls `onSelect` with the chosen item, removes the "@query" text, and hides any ids you pass in `selected`.
- **PromptInput** has an `onKeyDown` prop that runs before its own keys. If a handler calls `preventDefault()`, Enter won't send. That's what lets a picker claim Enter while its menu is open.

To use both pickers on one input, nest them and chain the handlers: the slash menu gets the key first, and if it didn't use it, the mention menu gets a turn.

## Step 3: Build the power-user prompt input

Create `app/power-prompt.tsx`. It keeps three pieces of state — the text, the active command and the mentioned items — and sends them together as a structured payload:

```tsx title="app/power-prompt.tsx"
"use client";

import * as React from "react";
import { Languages, ListCollapse, ImageIcon, X } from "lucide-react";
import { PromptInput, PromptTool } from "@/components/ai/prompt-input";
import { SlashCommands, type SlashCommand } from "@/components/ai/slash-commands";
import { MentionPicker, MentionChip, type MentionItem } from "@/components/ai/mention-picker";

const commands: SlashCommand[] = [
  { id: "summarize", label: "Summarize", description: "Condense text or a file into key points", icon: <ListCollapse />, group: "Write" },
  { id: "translate", label: "Translate", description: "Translate into another language", icon: <Languages />, group: "Write", keywords: ["language"] },
  { id: "image", label: "Generate image", description: "Create an image from a description", icon: <ImageIcon />, group: "Create", keywords: ["picture", "img"] },
];

const mentionables: MentionItem[] = [
  { id: "f-roadmap", label: "roadmap-q4.md", type: "file", description: "docs/" },
  { id: "f-pricing", label: "pricing.csv", type: "file", description: "data/" },
  { id: "a-research", label: "Research agent", type: "agent", description: "Web search" },
  { id: "p-maya", label: "Maya Chen", type: "person", description: "Design" },
];

export type PromptPayload = { text: string; command?: string; context: string[] };

export function PowerPrompt({ onSend }: { onSend: (payload: PromptPayload) => void }) {
  const [input, setInput] = React.useState("");
  const [command, setCommand] = React.useState<SlashCommand | null>(null);
  const [mentions, setMentions] = React.useState<MentionItem[]>([]);

  function send(text: string) {
    onSend({ text, command: command?.id, context: mentions.map((m) => m.id) });
    setInput("");
    setCommand(null);
    setMentions([]);
  }

  return (
    <SlashCommands value={input} onValueChange={setInput} commands={commands} onRun={setCommand}>
      {(slash) => (
        <MentionPicker
          value={input}
          onValueChange={setInput}
          items={mentionables}
          selected={mentions.map((m) => m.id)}
          onSelect={(item) => setMentions((m) => [...m, item])}
        >
          {(mention) => (
            <PromptInput
              value={input}
              onValueChange={setInput}
              onSubmit={send}
              placeholder={command ? `${command.label}…` : "Ask anything, / for commands, @ to add context"}
              onKeyDown={(e) => {
                slash.onKeyDown(e);
                if (!e.defaultPrevented) mention.onKeyDown(e);
              }}
              attachments={
                mentions.length > 0 &&
                mentions.map((m) => (
                  <MentionChip key={m.id} item={m} onRemove={() => setMentions((all) => all.filter((x) => x.id !== m.id))} />
                ))
              }
              tools={
                command && (
                  <PromptTool active icon={command.icon} onClick={() => setCommand(null)}>
                    {command.label}
                    <X />
                  </PromptTool>
                )
              }
            />
          )}
        </MentionPicker>
      )}
    </SlashCommands>
  );
}
```

A few decisions worth copying:

- **The command becomes a mode, not text.** Picking "/summarize" shows a pressed "Summarize" tool in the bottom-left of the input and changes the placeholder. Clicking it turns the mode off. Your backend gets `command: "summarize"` instead of parsing it out of the message.
- **Mentions live in the attachments slot.** Each `MentionChip` has a remove button, and `selected` keeps attached items out of the list.
- **Everything resets on send.** The text, mode and chips clear together, so the next message starts clean.

Render it from any client component and pass your send handler. The pickers open upward, so leave room above the input:

```tsx title="app/composer.tsx"
"use client";

import { PowerPrompt } from "./power-prompt";

export function Composer() {
  return (
    <div className="mx-auto max-w-2xl p-6 pt-80">
      <PowerPrompt onSend={(payload) => console.log(payload)} />
    </div>
  );
}
```

In a real app, `onSend` would call your API with the payload: look up the mentioned files, add them to the model's context, and pick a system prompt based on the command. If you're adding this to a full chat screen, drop `PowerPrompt` in where the prompt box sits in the [Next.js chat tutorial](/blog/chatgpt-style-chat-ui-nextjs) and keep its `status` and `onStop` props as they are.

## Accessibility and keyboard details

Menus that live inside a text box are easy to make inaccessible. Here's what the components handle, and what's left to you.

- **Focus stays in the textarea.** The menus never take focus, so typing continues naturally and a screen reader user doesn't lose their place.
- **Real list semantics.** Each menu is a `listbox` with `option` rows, and the highlighted row has `aria-selected`. Groups use `role="group"` with a label.
- **Mouse clicks don't steal focus.** The menu cancels `mousedown`, so clicking an option picks it without blurring the input.
- **IME-safe Enter.** Enter is ignored while a Japanese, Chinese or Korean input method is composing, so picking a character doesn't run a command.
- **Removable chips.** Every chip's remove button has a label like "Remove pricing.csv".
- **Visible hints.** The slash menu shows "↑↓ to navigate · Enter to run · Esc to close" on larger screens. Pair it with a [Kbd](/components/kbd) hint in your placeholder or help screen if your audience is new to shortcuts.

What's left to you: keep command labels short and verb-first ("Summarize", not "Summary tool"), and write descriptions that say what happens, because that's what people read when they're unsure.

## When to use a command bar instead

Slash commands act on the message being written. Actions that aren't about the prompt — switching workspaces, opening settings, starting a new chat — belong in a ⌘K [Command Bar](/components/command-bar). Keep the two lists separate so neither grows into a junk drawer.

## Checklist

1. "/" opens the menu only at the start of the message.
2. "@" opens after a space or at the start, never inside an email.
3. Arrow keys move, Enter and Tab pick, Esc closes and keeps the text.
4. Enter never picks and sends at the same time.
5. Label matches rank above description matches, with keywords for synonyms.
6. Each row shows its command id.
7. Mentions become removable chips, and attached items disappear from the list.
8. The command and mentions reach your backend as structured data.

A power-user input costs a few components and pays off every session after the first. For how it fits into the rest of the chat experience, read the [AI chat UI design guide](/blog/ai-chat-ui-design-guide), or browse all [components](/components).
