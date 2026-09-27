---
title: "Let Cursor and Claude Install Your UI: A Guide to the shadcn MCP Server"
seoTitle: "shadcn MCP Server: Setup for Cursor and Claude Code"
description: Set up the shadcn MCP server in Cursor, Claude Code or VS Code, add a third-party registry, and let your AI assistant search and install components for you.
date: 2026-09-27
weight: 40
topic: tutorials
tags: [mcp, shadcn, cursor, claude code, vibe coding]
coverTitle: Let your AI editor install your UI
coverAlt: Cover image for "Let Cursor and Claude Install Your UI — A Guide to the shadcn MCP Server", showing an AI chat prompt asking for a component next to the files it installed.
components: [prompt-input, model-selector, conversation, reasoning, message, streaming-text]
tldr:
  - The shadcn MCP server lets AI assistants like Claude Code, Cursor and GitHub Copilot in VS Code browse, search and install components from any shadcn-compatible registry.
  - Add a registry once under "registries" in components.json, then run npx shadcn@latest mcp init with --client claude, cursor, vscode, codex or opencode.
  - Install the theme before asking for components, so every component the assistant adds has the tokens and Tailwind preset it depends on.
  - If the server doesn't show up, restart the client, enable it in settings, and clear the npx cache; if a registry isn't found, check the URL in components.json and that its registry.json index loads.
faq:
  - q: What does the shadcn MCP server do?
    a: It connects your AI assistant to the shadcn CLI and the registries in your components.json. The assistant can list and search components, read what they are, and install them into your project from a plain-language prompt.
  - q: Which editors support the shadcn MCP server?
    a: The shadcn docs give setup steps for Claude Code, Cursor, VS Code with GitHub Copilot, Codex and OpenCode. Any client that speaks MCP can run it with the command npx shadcn@latest mcp.
  - q: Can the shadcn MCP server install components from registries other than shadcn/ui?
    a: Yes. It works with any shadcn-compatible registry. Add the registry to the registries key in components.json with a namespace like @{{brand.slug}}, and the assistant can search and install from it.
  - q: Why does my AI assistant say it can't find the registry?
    a: Usually the registry isn't in components.json, the URL has a typo, or you're in a different folder than the one with components.json. The MCP server also reads a registry index file, so check that the registry's registry.json loads in a browser.
---

The shadcn MCP server lets Cursor, Claude Code and other AI assistants search component registries and install components into your project from a plain-language prompt. Set it up with one command, add the registries you want in `components.json`, and "add a prompt input with a model picker" becomes real files in your repo — not a component your assistant improvised from memory.

This guide covers what the server does, how to set it up for each editor, how to add the {{brand.name}} registry, and what to do when it doesn't work.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open standard that lets AI assistants connect to outside tools and data. An MCP server exposes a set of tools; an MCP client — Claude Code, Cursor, VS Code with GitHub Copilot — lets the model call them while it works. Instead of guessing, the model can look things up and take real actions.

## What does the shadcn MCP server do?

According to the [shadcn MCP docs](https://ui.shadcn.com/docs/registry/mcp), the server is a bridge between your AI assistant, component registries and the shadcn CLI. It gives the assistant four abilities:

- **Browse components** — list the components, blocks and templates in any configured registry.
- **Search across registries** — find components by name or by what they do.
- **Install with natural language** — add components from prompts like "add a login form".
- **Use multiple registries** — the default shadcn/ui registry, third-party registries and private company registries, each under its own `@namespace`.

The practical win is accuracy. Without it, an assistant writes a "chat input" from its training data, with its own idea of styles and states. With it, the assistant finds the real component, reads what it is, and installs the exact files through the CLI — dependencies included.

If you build with Cursor or Claude, this is also the fastest fix for [the generic look of vibe-coded apps](/blog/vibe-coded-app-design): the assistant stops inventing UI and starts using designed components.

## Step 1: Add the registry to components.json

The server reads registries from your project's `components.json`, so that file needs to exist. If you haven't set up shadcn yet, run `npx shadcn@latest init` first.

Then add the {{brand.short}} registry under `registries`. Keep everything else in the file as it is:

```json title="components.json"
{
  "registries": {
    "@{{brand.slug}}": "{{brand.url}}/r/{name}.json"
  }
}
```

The `{name}` placeholder is where the CLI puts the component name, so `@{{brand.slug}}/prompt-input` resolves to `{{brand.url}}/r/prompt-input.json`. You don't need anything extra for the standard shadcn/ui registry — it's available by default.

## Step 2: Install the theme first

Every {{brand.short}} component uses the same design tokens and Tailwind preset. Install the theme once before asking your assistant for components:

```bash
npx shadcn@latest add @{{brand.slug}}/theme
```

New Next.js and Vite projects use Tailwind v4, which doesn't create a config file. Add one that loads the preset:

```js title="tailwind.config.js"
module.exports = {
  presets: [require("./tailwind.preset.js")],
};
```

Then load the tokens and the config in your global CSS, right after the Tailwind import:

```css title="app/globals.css"
@import "tailwindcss";
@import "../styles/{{brand.slug}}-tokens.css";
@config "../tailwind.config.js";
```

You can also just ask your assistant to do this once the server is running — "install the {{brand.short}} theme and set it up for Tailwind v4" — but it's worth checking these three lines yourself. Our [Next.js chat tutorial](/blog/chatgpt-style-chat-ui-nextjs) shows the same setup in a fresh app.

## Step 3: Set up the MCP server in your editor

The shadcn CLI can write the MCP config for you. Run it in your project folder with the client you use:

```bash
# Claude Code
npx shadcn@latest mcp init --client claude

# Cursor
npx shadcn@latest mcp init --client cursor

# VS Code (GitHub Copilot)
npx shadcn@latest mcp init --client vscode
```

The docs also list `--client codex` and `--client opencode`. For Codex, the CLI can't edit `~/.codex/config.toml` for you, so you add the config there by hand.

Skip Claude Desktop for this. The server reads `components.json` and writes files into the current project, and Claude Desktop doesn't run inside a project folder, so there's nothing for it to install into. Cursor, Claude Code and VS Code all open your project directly, which is what this workflow needs.

After running it, each editor needs one more step:

- **Claude Code:** restart it, then run `/mcp`. You should see the shadcn server marked as connected.
- **Cursor:** open Cursor Settings and enable the shadcn MCP server. A green dot next to it means it's running.
- **VS Code:** open `.vscode/mcp.json` and click **Start** next to the shadcn server.

### Manual configuration

If you'd rather write the config yourself, it's one entry. For Claude Code, create `.mcp.json` in the project root. For Cursor, use `.cursor/mcp.json`:

```json title=".mcp.json"
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

VS Code uses a `servers` key instead of `mcpServers`, in `.vscode/mcp.json`:

```json title=".vscode/mcp.json"
{
  "servers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

For Codex, add this to `~/.codex/config.toml`:

```toml title="~/.codex/config.toml"
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

Our [AI tools docs](/docs/ai-tools) have the same config alongside the other ways to use {{brand.short}} with AI.

## Step 4: Ask for components

With the server connected, talk to your assistant the way you'd brief a teammate. Be specific about the registry, so it doesn't fall back to building from scratch:

- "Show me the components in the {{brand.slug}} registry."
- "Find a component in the {{brand.slug}} registry for showing the model's reasoning."
- "Install @{{brand.slug}}/prompt-input and @{{brand.slug}}/model-selector."
- "Build a chat page using the conversation, message, prompt-input and streaming-text components from the {{brand.slug}} registry."

For a chat screen, the assistant should end up installing the [Conversation](/components/conversation), [Prompt Input](/components/prompt-input), [Model Selector](/components/model-selector) and friends, then wiring them together. Compare the result with the [ChatGPT-style chat UI tutorial](/blog/chatgpt-style-chat-ui-nextjs) — it's the same build, done by hand, and a good reference for what the assistant should produce.

A few habits that help:

- **Name the component.** "Add @{{brand.slug}}/reasoning" beats "add a thinking thing". Browse [the components page](/components) and copy the name.
- **Ask it to read the design notes.** Each {{brand.short}} registry item includes notes on how it's meant to be used — for example, that [Reasoning](/components/reasoning) collapses once the answer starts. Assistants follow rules better when they read them.
- **Review the diff.** The CLI copies source files into your project. Read what was added before you build on it.

## Give your assistant the whole catalog with llms.txt

MCP answers "find and install". For broader context — which component fits a problem — point your assistant at `{{brand.url}}/llms.txt`. It lists every component with a one-line description and a link. `{{brand.url}}/llms-full.txt` adds each component's features and design notes.

Paste the URL into a prompt, or add it to your editor's docs or rules settings if it supports that. Because it's just a URL, it also works in tools where you can't run an MCP server.

## Troubleshooting

### The server doesn't show up

1. **Restart the client.** Claude Code and Codex need a restart after config changes.
2. **Enable it.** In Cursor it must be switched on in settings; in VS Code you click Start.
3. **Check where the config is.** `.mcp.json`, `.cursor/mcp.json` and `.vscode/mcp.json` live in the project root, not your home folder.
4. **"No tools or prompts"?** The shadcn docs suggest clearing the npx cache with `npx clear-npx-cache`, then re-enabling the server. In Cursor, check the logs under View → Output and pick the MCP entry in the dropdown.

In Claude Code, `/mcp` is the fastest way to see whether the server connected and what went wrong.

### The registry isn't found

1. **Check components.json.** The `registries` key must be at the top level, and the name must start with `@`.
2. **Check the URL.** Open `{{brand.url}}/r/theme.json` in a browser. If it loads, the URL pattern is right.
3. **Check the index.** The MCP server discovers a registry through its index file. Open `{{brand.url}}/r/registry.json` — it should list every component.
4. **Use the namespace.** Ask for `@{{brand.slug}}/prompt-input`, not just "prompt-input", which points at the default shadcn registry.

### Components install but look unstyled

That's almost always the Tailwind v4 setup. Check that `tailwind.config.js` loads the preset, and that your global CSS has both the tokens import and the `@config` line from Step 2. Paths in `@import` and `@config` are relative to the CSS file, so adjust them if your stylesheet lives somewhere other than `app/globals.css`.

## Setup checklist

1. `components.json` exists and has the `@{{brand.slug}}` registry.
2. The theme is installed and the Tailwind v4 config and CSS lines are in place.
3. `npx shadcn@latest mcp init --client <your editor>` has run, and the server is enabled.
4. The client shows the server as connected.
5. Prompts name the registry or the exact component.

Once it's set up, your assistant builds with real, designed components instead of improvising them. Start with the [AI chat UI design guide](/blog/ai-chat-ui-design-guide) for what to build, then browse the [components](/components) and ask for them by name.
