import * as React from "react";
import { ArrowRight } from "lucide-react";
import { registry, sections } from "../registry";
import { META, H2, H3, P, Code, hrefFor } from "../lib";
import { REGISTRY_URL as REGISTRY } from "./component-page";
import { Badge, Alert, Accordion, cn } from "../../src";

function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header>
      <p className="text-sm text-fg-subtle">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold text-fg">{title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-fg-muted">{lead}</p>
    </header>
  );
}

/* ───────────── Introduction ───────────── */
const A = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} className="font-medium text-fg underline decoration-border-strong underline-offset-4 hover:decoration-fg">{children}</a>;

export function Introduction() {
  const count = (id: string) => registry.filter((r) => r.section === id).length;
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Overview" title="Introduction" lead="Promptline UI is a free, open-source library of components for building AI products — the chat, the agent, and everything around them." />
      <section className="space-y-4">
        <H2 id="what">What is Promptline UI?</H2>
        <P>Promptline UI is a set of {registry.length} React components styled with Tailwind CSS: {count("ai")} built specifically for AI products and {count("ui")} general UI components they're made from. Each one is a single file you copy into your project and own — there is no package to install and no runtime dependency on this library.</P>
        <P>Every component page includes a live preview, the code, installation options for people and AI tools, an API reference, and <strong className="text-fg">design notes</strong>: short explanations of why the component behaves the way it does, so you can change it without breaking what matters.</P>
      </section>
      <section className="space-y-4">
        <H2 id="shadcn">How it relates to shadcn/ui and AI Elements</H2>
        <P>Promptline follows the same copy-and-own model as <A href="https://ui.shadcn.com">shadcn/ui</A>, and every component is published as a shadcn registry item, so the shadcn CLI and MCP server work with it. It's not a fork: the components are written from scratch with their own tokens, and don't require Radix or any other UI library.</P>
        <P>Libraries like <A href="https://elements.ai-sdk.dev">AI Elements</A> focus on the conversation. Promptline covers that too, and adds the parts real products need around it: credits and paywalls, rate limits and errors, approvals, diffs, memory, onboarding, and AI outside the chat (inline editing, command bars, generate buttons).</P>
      </section>
      <section className="space-y-4">
        <H2 id="who">Who is it for?</H2>
        <ul className="list-disc space-y-2 pl-5 text-base text-fg-muted">
          <li><strong className="text-fg">Founders and vibe coders</strong> building with Lovable, Bolt, v0 or Cursor who want their product to look designed — copy one prompt per component.</li>
          <li><strong className="text-fg">Developers</strong> who want accessible, well-built pieces without adopting a whole framework.</li>
          <li><strong className="text-fg">Designers</strong> who want a reference for how AI interfaces should behave, with the reasoning written down.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <H2 id="open-source">Open source</H2>
        <P>Promptline UI is MIT licensed and free forever — for personal and commercial projects. Use it, change it, ship it. If you build something with it, a link back is appreciated but not required.</P>
      </section>
      <section className="space-y-4">
        <H2 id="next">Next steps</H2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[["#/docs/installation", "Installation", "Set up tokens and add your first component."], ["#/components", "Browse components", `All ${registry.length} components, grouped.`], ["#/docs/ai-tools", "AI Tools & MCP", "Use Promptline from your AI coding tool."]].map(([h, t, d]) => (
            <a key={h} href={h} className="group rounded-lg border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface">
              <p className="flex items-center justify-between text-base font-medium text-fg">{t}<ArrowRight className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5" /></p>
              <p className="mt-1 text-sm text-fg-muted">{d}</p>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}

/* ───────────── Why Promptline ───────────── */
export function Why() {
  const items: [string, string][] = [
    ["Covers the whole product, not just the chat", "Paywalls, usage meters, rate limits, approvals, memory, knowledge uploads, model status — the states users actually run into, designed and ready."],
    ["Explains every decision", "Each component ships design notes. When you customise it, you know which details are load-bearing (like keeping Stop where Send was)."],
    ["You own the code", "Components are single files with no runtime dependency on this library. Edit anything; nothing breaks on the next version."],
    ["Built for AI coding tools", "One-click prompts, shadcn registry items and llms.txt carry the code, tokens and design rules into Lovable, Bolt, v0, Cursor and Claude."],
    ["Accessible by default", "Keyboard support, focus management, screen-reader labels and reduced-motion handling are built in, not left as homework."],
    ["Neutral and exact", "A monochrome base, one accent token, a ten-step type scale and a 4px grid. It looks right next to your brand — and becomes your brand with one variable."],
  ];
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Overview" title="Why Promptline" lead="What you get compared with building AI interfaces from scratch or from a generic UI kit." />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(([t, d], i) => (
          <section key={t} className="rounded-lg border border-border p-5">
            <p className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</p>
            <H3 id={`why-${i}`} className="mt-2 text-base">{t}</H3>
            <P className="mt-1">{d}</P>
          </section>
        ))}
      </div>
    </article>
  );
}

/* ───────────── Changelog ───────────── */
export function Changelog() {
  const log: [string, string, string[]][] = [
    ["100+ components", "September 2026", [
      "10 new AI components: Slash Commands, Mention Picker, Streaming Text, Research Progress, Voice Mode, Audio Player, JSON Viewer, Share Dialog, Connectors and Agent Gallery.",
      "4 new UI components: Date Picker, Tags Input, Number Input and Resizable Panels.",
      "Prompt Input now accepts onKeyDown, so command and mention menus can plug into it.",
    ]],
    ["Big update", "September 2026", [
      "36 UI components: forms, overlays, navigation, menus and data display.",
      "13 new AI components including Clarifying Question, Diff View, Agent Runs, Knowledge Upload and Usage Chart.",
      "Data Table rebuilt as a complete card with filters, row menus and rows-per-page.",
      "Theme Builder, shadcn registry items, llms.txt and a separate docs section.",
    ]],
    ["First release", "September 2026", ["38 AI components with design notes, neutral tokens and copy-paste prompts."]],
  ];
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Overview" title="Changelog" lead="What's new in each release." />
      <ol className="space-y-10">
        {log.map(([v, d, items]) => (
          <li key={v} className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div><p className="text-lg font-semibold text-fg">{v}</p><p className="text-sm text-fg-subtle">{d}</p></div>
            <ul className="list-disc space-y-2 pl-5 text-base text-fg-muted">{items.map((x) => <li key={x}>{x}</li>)}</ul>
          </li>
        ))}
      </ol>
    </article>
  );
}

/* ───────────── Components index ───────────── */
export function ComponentsIndex() {
  const count = (id: string) => registry.filter((r) => r.section === id).length;
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Components" title="Components" lead={`${registry.length} components: ${count("ai")} for AI products and ${count("ui")} UI building blocks. Each page has a live preview, code, install options and design notes.`} />
      {sections.map((sec) => (
        <section key={sec.id} className="space-y-8">
          <H2 id={sec.id}>{sec.title} <span className="font-normal text-fg-subtle">{count(sec.id)}</span></H2>
          {sec.groups.map((g) => (
            <div key={g}>
              <H3 className="mb-3 text-base">{g}</H3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {registry.filter((r) => r.section === sec.id && r.group === g).map((r) => (
                  <a key={r.slug} href={hrefFor(r)} className="group rounded-md border border-border px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface">
                    <span className="flex items-center justify-between text-base font-medium text-fg">
                      <span className="flex items-center gap-2">{r.name}{r.isNew && <Badge tone="info">New</Badge>}</span>
                      <ArrowRight className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-fg-muted">{r.description}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </article>
  );
}

/* ───────────── Usage ───────────── */
export function Usage() {
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Usage" title="Usage" lead="How Promptline components are built, and the patterns they share — so any component feels familiar once you've used one." />
      <section className="space-y-4">
        <H2 id="import">Importing</H2>
        <P>Components live in your project, so you import them from your own folders. The <code>@/</code> alias below assumes the usual <code>src</code> alias.</P>
        <Code code={`import { PromptInput } from "@/components/ai/prompt-input";\nimport { Button } from "@/components/ui/button";`} />
      </section>
      <section className="space-y-4">
        <H2 id="controlled">Controlled and uncontrolled</H2>
        <P>Inputs follow React conventions: pass <code>value</code> + <code>onValueChange</code> to control them, or <code>defaultValue</code> to let them manage their own state. Open/close components use <code>open</code> + <code>onOpenChange</code> (or <code>defaultOpen</code>).</P>
        <Code code={`const [model, setModel] = React.useState("swift");\n<ModelSelector models={models} value={model} onValueChange={setModel} />`} />
      </section>
      <section className="space-y-4">
        <H2 id="slots">Slots</H2>
        <P>AI components expose named slots instead of dozens of props. <code>Message</code> has <code>header</code> (reasoning, tools) and <code>footer</code> (actions, sources); <code>PromptInput</code> has <code>attachments</code>, <code>tools</code> and <code>hint</code>. Put any component in any slot.</P>
        <Code code={`<Message\n  from="assistant"\n  header={<Reasoning duration={4}>…</Reasoning>}\n  footer={<Actions><CopyAction text={text} /></Actions>}\n>\n  {text}\n</Message>`} />
      </section>
      <section className="space-y-4">
        <H2 id="styling">Styling</H2>
        <P>Every component accepts <code>className</code>, merged with <code>cn()</code> so your classes win over the defaults. Use the token classes — <code>bg-surface</code>, <code>text-fg-muted</code>, <code>border-border</code> — so your changes work in light and dark mode.</P>
        <Code code={`<Button className="w-full">Continue</Button>\n<Card className="bg-surface">…</Card>`} />
      </section>
      <section className="space-y-4">
        <H2 id="states">Status props</H2>
        <P>AI components describe the request lifecycle with a single <code>status</code> or <code>state</code> prop (<code>ready → submitted → streaming → error</code> for the prompt input; <code>pending → running → completed | error</code> for tools). Map your API's state to it and the UI follows.</P>
      </section>
      <section className="space-y-4">
        <H2 id="a11y">Accessibility</H2>
        <P>Keyboard handling, focus trapping, ARIA roles and live regions are built in. Keep them when customising: icon-only buttons need an <code>aria-label</code>, and custom triggers passed to menus and popovers must be focusable elements.</P>
      </section>
    </article>
  );
}

/* ───────────── Troubleshooting ───────────── */
export function Troubleshooting() {
  const items = [
    ["Components look unstyled", "Check that tokens.css is imported once in your global CSS and that tailwind.preset.js is in your Tailwind config's presets. Also make sure the component folder is inside Tailwind's content paths."],
    ["Colours are wrong in dark mode", "Promptline uses class-based dark mode. Add the dark class to <html>, not a media query. If you use next-themes, set attribute=\"class\"."],
    ["Menus or popovers appear in the wrong place", "They render in a portal with fixed positioning. A parent with transform, filter or perspective creates a new containing block — remove it, or render the component outside that parent."],
    ["text-md or text-2xs does nothing", "Those sizes come from the preset. If you use Tailwind v4, copy the fontSize values into your @theme block."],
    ["\"Cannot find module '@/lib/cn'\"", "Copy the helpers from the Installation page, or update the import paths to match your folder structure."],
    ["The AI tool restyled the component", "Paste the full prompt from the component page — it tells the tool to keep class names as-is. If it still changes things, ask it to \"use the file exactly as provided\"."],
  ];
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Usage" title="Troubleshooting" lead="Fixes for the most common setup problems." />
      <Accordion type="multiple" items={items.map(([q, a], i) => ({ value: String(i), title: q, content: a }))} />
    </article>
  );
}

/* ───────────── Contributing ───────────── */
export function Contributing() {
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Contributing" title="How to Contribute" lead="Promptline gets better with every product that uses it. Here's how to help." />
      <section className="space-y-4">
        <H2 id="ways">Ways to help</H2>
        <ul className="list-disc space-y-2 pl-5 text-base text-fg-muted">
          <li><strong className="text-fg">Report issues</strong> — broken behaviour, accessibility gaps, confusing docs.</li>
          <li><strong className="text-fg">Suggest components</strong> — especially AI patterns you've needed and couldn't find.</li>
          <li><strong className="text-fg">Improve design notes</strong> — if you learned something from real users, write it down.</li>
          <li><strong className="text-fg">Send a pull request</strong> — fixes and new components are welcome.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <H2 id="setup">Local setup</H2>
        <Code code={"npm install\nnode scripts/build.mjs   # builds dist/index.html, the registry and llms.txt"} lang="bash" />
        <P>The docs are generated from the source: props come from TypeScript types, code samples from the demo files, and install prompts from the dependency graph. Change the source and rebuild.</P>
      </section>
      <section className="space-y-4">
        <H2 id="checklist">Before you open a pull request</H2>
        <ul className="list-disc space-y-2 pl-5 text-base text-fg-muted">
          <li>Uses only token classes and the type scale — no raw colours or arbitrary sizes.</li>
          <li>Works with keyboard only, in light and dark mode, and at 390px wide.</li>
          <li>Typechecks (<code className="font-mono text-sm text-fg">npx tsc -p .</code>) and the docs build.</li>
        </ul>
      </section>
    </article>
  );
}

export function NewComponents() {
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Contributing" title="New Components" lead="Adding a component takes three files." />
      <section className="space-y-4">
        <H2 id="source">1. The component</H2>
        <P>Create <code>src/components/ai/&lt;name&gt;.tsx</code> (or <code>ui/</code>). One file, a short header comment explaining what it's for, exported props interface with JSDoc on non-obvious props, and imports only from <code>lib/</code> and other components.</P>
      </section>
      <section className="space-y-4">
        <H2 id="demo">2. The demos</H2>
        <P>Create <code>docs/demos/&lt;name&gt;.tsx</code>. Each exported function becomes an example; the first is the main preview. Use realistic content — real-sounding tasks, not "Lorem ipsum".</P>
      </section>
      <section className="space-y-4">
        <H2 id="registry">3. The registry entry</H2>
        <P>Add an entry to <code>docs/registry.ts</code> with a one-sentence description, the exported names to document, a features list, and design notes.</P>
        <Code code={`{\n  slug: "clarifying-question",\n  name: "Clarifying Question",\n  group: "Agents",\n  description: "The agent asks before it acts…",\n  api: ["ClarifyingQuestion"],\n  features: ["Single or multiple choice", "Skip lets the agent decide"],\n  notes: ["A 5-second question beats 5 minutes of work in the wrong direction."],\n}`} lang="typescript" />
      </section>
      <section className="space-y-4">
        <H2 id="notes">Writing design notes</H2>
        <P>Two to five notes. Each explains a decision a user would notice, and why — ideally something you'd get wrong without being told. Plain language, one or two sentences each.</P>
      </section>
    </article>
  );
}

export function Philosophy() {
  const rules: [string, string][] = [
    ["Design for the moments that go wrong", "Waiting, failing, hitting limits and being unsure are where AI products win or lose trust. Those states get as much care as the happy path."],
    ["Show the work", "People trust AI they can inspect: visible reasoning, tool calls, sources and diffs. Hide detail by default; never make it unreachable."],
    ["Keep people in control", "Stop, undo, approve, edit, retry. Every consequential action has a way back or a way to say no."],
    ["Explain, don't just ship", "A component without its reasoning gets misused. Design notes are part of the component."],
    ["Quiet by default", "Neutral colours, one accent, colour only when it carries meaning. The user's content is the loudest thing on screen."],
    ["Copy, don't depend", "Code you own beats a dependency you wait on. Every file stands alone."],
  ];
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Contributing" title="Philosophy" lead="The principles behind every component — and the test for new ones." />
      <ol className="space-y-6">
        {rules.map(([t, d], i) => (
          <li key={t} className="flex gap-4">
            <span className="font-mono text-sm leading-7 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
            <div><H3 id={`p-${i}`}>{t}</H3><P className="mt-1">{d}</P></div>
          </li>
        ))}
      </ol>
    </article>
  );
}

/* ───────────── Installation ───────────── */
export function Installation() {
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Usage" title="Installation" lead="Set up the foundations once, then add components with a prompt, the CLI or copy-paste. Works with Next.js, Vite, Remix and any React + Tailwind project." />
      <section className="space-y-4">
        <H2 id="dependencies">1. Install dependencies</H2>
        <Code code="npm i lucide-react clsx tailwind-merge" lang="bash" />
      </section>
      <section className="space-y-4">
        <H2 id="tokens">2. Add the design tokens</H2>
        <P>Create <code>src/styles/tokens.css</code> and import it once, before Tailwind, in your global stylesheet. Load the <a href="https://fonts.google.com/specimen/Geist" className="font-medium text-fg underline underline-offset-4" target="_blank" rel="noreferrer">Geist</a> and Geist Mono fonts, or change <code>--font-sans</code>. The <a href="#/docs/theme" className="font-medium text-fg underline underline-offset-4">Theme Builder</a> generates a customised version.</P>
        <Code code={META.shared["styles/tokens.css"]} lang="css" filename="src/styles/tokens.css" maxHeight={360} />
      </section>
      <section className="space-y-4">
        <H2 id="preset">3. Add the Tailwind preset</H2>
        <P>Maps the tokens to classes like <code>bg-surface</code> and <code>text-fg-muted</code>, and defines the type scale.</P>
        <Code code={META.shared["tailwind.preset.js"]} lang="javascript" filename="tailwind.preset.js" maxHeight={360} />
        <Code code={`// tailwind.config.js\nmodule.exports = {\n  presets: [require("./tailwind.preset.js")],\n  content: ["./src/**/*.{ts,tsx}"],\n};`} lang="javascript" />
      </section>
      <section className="space-y-4">
        <H2 id="utils">4. Add the helpers</H2>
        <P>Every component uses <code>cn</code>. Interactive ones use <code>hooks</code>, and menus, selects and popovers use <code>floating</code>.</P>
        <Code code={META.shared["lib/cn.ts"]} filename="src/lib/cn.ts" />
        <Code code={META.shared["lib/hooks.ts"]} filename="src/lib/hooks.ts" maxHeight={260} />
        <Code code={META.shared["lib/floating.tsx"]} filename="src/lib/floating.tsx" maxHeight={260} />
      </section>
      <section className="space-y-4">
        <H2 id="add">5. Add components</H2>
        <P>Open any component and use the <strong className="text-fg">AI prompt</strong>, <strong className="text-fg">CLI</strong> or <strong className="text-fg">Manual</strong> tab. Each page lists exactly which other files it needs.</P>
      </section>
      <section className="space-y-4">
        <H2 id="dark-mode">6. Dark mode</H2>
        <P>Add the <code>dark</code> class to <code>&lt;html&gt;</code>. Every component follows the tokens automatically.</P>
      </section>
    </article>
  );
}

/* ───────────── AI tools ───────────── */
export function AiTools() {
  const mcp = `{\n  "mcpServers": {\n    "shadcn": {\n      "command": "npx",\n      "args": ["shadcn@latest", "mcp"]\n    }\n  }\n}`;
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Usage" title="AI Tools & MCP" lead="Promptline is built to be used by people and by AI coding tools. Every component ships its design rules, so the tools follow them too." />
      <section className="space-y-4">
        <H2 id="prompt">Copy a prompt</H2>
        <P>Every page has an <strong className="text-fg">AI prompt</strong> tab. It contains the component, every file it depends on, the tokens, the Tailwind preset, the design notes and a usage example — paste it into Lovable, Bolt, v0, Cursor or Claude.</P>
      </section>
      <section className="space-y-4">
        <H2 id="cli">shadcn CLI</H2>
        <P>Each component is published as a shadcn registry item. Add the namespace once to <code>components.json</code>, then install by name.</P>
        <Code code={`{\n  "registries": {\n    "@promptline": "${REGISTRY}/{name}.json"\n  }\n}`} lang="json" filename="components.json" />
        <Code code={"npx shadcn@latest add @promptline/prompt-input @promptline/reasoning"} lang="bash" />
      </section>
      <section className="space-y-4">
        <H2 id="mcp">MCP server</H2>
        <P>The shadcn MCP server reads the registries in your <code>components.json</code>, so once <code>@promptline</code> is added (above), Claude, Cursor or Windsurf can search, read and install Promptline components for you. Run <code>npx shadcn@latest mcp init --client claude</code> (or cursor, vscode) to set it up, or add the config manually:</P>
        <Code code={mcp} lang="json" filename="mcp config" />
        <P>Then ask: <code>"Add a Promptline prompt input with a model selector"</code>.</P>
      </section>
      <section className="space-y-4">
        <H2 id="llms">llms.txt</H2>
        <P><code>/llms.txt</code> lists every component with its description and link; <code>/llms-full.txt</code> adds the design notes. Point any AI tool at it for context.</P>
      </section>
      <Alert tone="info" title="Hosting required">The CLI, MCP and llms.txt URLs work once the docs and <code className="font-mono text-sm">/r</code> folder are deployed (e.g. to Vercel). The registry files are generated by the build.</Alert>
    </article>
  );
}

/* ───────────── Colors ───────────── */
const colorTokens: [string, string, string, string, string][] = [
  ["bg", "Page background", "bg-bg", "#FFFFFF", "#0A0A0A"],
  ["surface", "Cards, sidebars, code", "bg-surface", "#FAFAFA", "#111111"],
  ["surface-2", "Hover, inputs, user bubble", "bg-surface-2", "#F2F2F2", "#1C1C1C"],
  ["border", "Hairlines", "border-border", "#EBEBEB", "#262626"],
  ["border-strong", "Hover and focus borders", "border-border-strong", "#D6D6D6", "#404040"],
  ["fg", "Primary text", "text-fg", "#171717", "#EDEDED"],
  ["fg-muted", "Secondary text", "text-fg-muted", "#666666", "#A1A1A1"],
  ["fg-subtle", "Meta, placeholders", "text-fg-subtle", "#8F8F8F", "#737373"],
  ["accent", "Primary actions (brand)", "bg-accent", "#171717", "#EDEDED"],
  ["success", "Completed, valid", "text-success", "#16A34A", "#22C55E"],
  ["warning", "Limits, high risk", "text-warning", "#D97706", "#F59E0B"],
  ["danger", "Errors, destructive", "text-danger", "#DC2626", "#F87171"],
  ["info", "Active, new", "text-info", "#2563EB", "#60A5FA"],
];
export const brands = [
  { name: "Neutral", l: "23 23 23", d: "237 237 237", fgL: "255 255 255", fgD: "10 10 10" },
  { name: "Blue", l: "37 99 235", d: "96 165 250", fgL: "255 255 255", fgD: "10 10 10" },
  { name: "Violet", l: "124 58 237", d: "167 139 250", fgL: "255 255 255", fgD: "10 10 10" },
  { name: "Emerald", l: "5 150 105", d: "52 211 153", fgL: "255 255 255", fgD: "10 10 10" },
  { name: "Orange", l: "234 88 12", d: "251 146 60", fgL: "255 255 255", fgD: "10 10 10" },
];

export function applyBrand(name: string) {
  const r = document.documentElement;
  if (name === "custom" && r.dataset.accentLight) {
    const acc = r.classList.contains("dark") ? r.dataset.accentDark! : r.dataset.accentLight;
    r.style.setProperty("--accent", acc);
    r.style.setProperty("--accent-fg", luminanceOf(acc) > 0.4 ? "10 10 10" : "255 255 255");
    return;
  }
  const b = brands.find((x) => x.name === name) ?? brands[0];
  r.dataset.brand = b.name;
  const dark = r.classList.contains("dark");
  if (b.name === "Neutral") { r.style.removeProperty("--accent"); r.style.removeProperty("--accent-fg"); }
  else { r.style.setProperty("--accent", dark ? b.d : b.l); r.style.setProperty("--accent-fg", dark ? b.fgD : b.fgL); }
}

export function Colors() {
  const [brand, setBrand] = React.useState(() => document.documentElement.dataset.brand ?? "Neutral");
  const apply = (b: (typeof brands)[number]) => { applyBrand(b.name); setBrand(b.name); };
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Foundations" title="Colors" lead="A neutral scale for surfaces and text, one accent for primary actions, and four semantic colours used only when they carry meaning." />
      <section className="space-y-4">
        <H2 id="tokens">Tokens</H2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface text-xs text-fg-muted"><tr><th className="h-10 px-4 font-medium">Token</th><th className="h-10 px-4 font-medium">Use</th><th className="h-10 px-4 font-medium">Class</th><th className="h-10 px-4 font-medium">Light</th><th className="h-10 px-4 font-medium">Dark</th></tr></thead>
            <tbody className="divide-y divide-border">
              {colorTokens.map(([t, use, cls, l, d]) => (
                <tr key={t}>
                  <td className="px-4 py-3"><span className="flex items-center gap-3"><span className="size-6 rounded-sm ring-1 ring-inset ring-fg/10" style={{ background: `rgb(var(--${t}))` }} /><code className="font-mono text-sm text-fg">--{t}</code></span></td>
                  <td className="px-4 py-3 text-fg-muted">{use}</td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-fg-muted">{cls}</code></td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">{l}</td>
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-4">
        <H2 id="rebrand">Rebrand</H2>
        <P>The kit is monochrome by default. Change <code>--accent</code> and <code>--accent-fg</code> to apply your brand to every primary button, badge and highlight. Try it — the whole site updates.</P>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button key={b.name} type="button" onClick={() => apply(b)} aria-pressed={brand === b.name}
              className={cn("inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors", brand === b.name ? "border-fg text-fg" : "border-border text-fg-muted hover:text-fg")}>
              <span className="size-4 rounded-full ring-1 ring-inset ring-fg/10" style={{ background: `rgb(${b.l})` }} />{b.name}
            </button>
          ))}
        </div>
        <Code code={`:root { --accent: 37 99 235;  --accent-fg: 255 255 255; }  /* light */\n.dark { --accent: 96 165 250; --accent-fg: 10 10 10; }     /* dark  */`} lang="css" />
      </section>
      <section className="space-y-4">
        <H2 id="rules">Rules</H2>
        <ul className="list-disc space-y-2 pl-5 text-base text-fg-muted">
          <li>Red is for real errors only. Limits, policies and offline states are neutral — the user did nothing wrong.</li>
          <li>Amber means "pay attention": high-risk approvals, usage past 80%.</li>
          <li>Text on surfaces uses <code className="font-mono text-sm text-fg">fg</code>, <code className="font-mono text-sm text-fg">fg-muted</code> or <code className="font-mono text-sm text-fg">fg-subtle</code> — never raw greys.</li>
          <li>Semantic backgrounds are the colour at 4–10% opacity, e.g. <code className="font-mono text-sm text-fg">bg-danger/[0.04]</code>.</li>
        </ul>
      </section>
    </article>
  );
}

/* ───────────── Typography ───────────── */
const scale: [string, string, string, string][] = [
  ["text-4xl", "30 / 36", "Display, page titles in docs", "semibold"],
  ["text-3xl", "24 / 32", "Empty-state titles", "semibold"],
  ["text-2xl", "20 / 28", "Section titles", "semibold"],
  ["text-xl", "18 / 28", "Dialog and card titles", "semibold"],
  ["text-lg", "16 / 24", "Lead paragraphs", "normal"],
  ["text-md", "15 / 24", "Chat message body — reading text", "normal"],
  ["text-base", "14 / 20", "Default UI text, buttons, inputs", "normal"],
  ["text-sm", "13 / 20", "Secondary UI, menus, small buttons", "normal"],
  ["text-xs", "12 / 16", "Meta, captions, timestamps", "normal"],
  ["text-2xs", "11 / 16", "Badges, keyboard keys", "medium"],
];

export function Typography() {
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Foundations" title="Typography" lead="Geist for interface and reading, Geist Mono for code and data. Ten sizes, each with a fixed line height on the 4px grid. Components use nothing else." />
      <section className="space-y-4">
        <H2 id="scale">Type scale</H2>
        <div className="divide-y divide-border rounded-lg border border-border">
          {scale.map(([cls, size, use, weight]) => (
            <div key={cls} className="grid gap-2 p-4 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-6">
              <div>
                <code className="font-mono text-sm text-fg">{cls}</code>
                <p className="text-xs text-fg-subtle">{size} · {weight}</p>
              </div>
              <div className="min-w-0">
                <p className={cn(cls, "truncate text-fg", weight === "semibold" && "font-semibold", weight === "medium" && "font-medium")}>Ship AI products people trust</p>
                <p className="text-xs text-fg-subtle">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <H2 id="weights">Weights</H2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[["400", "Regular", "Body and UI text"], ["500", "Medium", "Labels, buttons, emphasis"], ["600", "Semibold", "Titles only"]].map(([w, n, u]) => (
            <div key={w} className="rounded-lg border border-border p-5">
              <p className="text-3xl text-fg" style={{ fontWeight: Number(w) }}>Aa</p>
              <p className="mt-2 text-sm font-medium text-fg">{n} · {w}</p>
              <p className="text-xs text-fg-muted">{u}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <H2 id="rules">Rules</H2>
        <ul className="list-disc space-y-2 pl-5 text-base text-fg-muted">
          <li>Chat answers use <code className="font-mono text-sm text-fg">text-md</code> (15/24). Everything else in the UI uses 14 or smaller.</li>
          <li>Headings get slight negative tracking from 18px up; body text keeps default tracking.</li>
          <li>Numbers that change (counts, timers, prices) use <code className="font-mono text-sm text-fg">tabular-nums</code> so they don't jitter.</li>
          <li>Never use arbitrary sizes like <code className="font-mono text-sm text-fg">text-[13px]</code> — pick from the scale.</li>
        </ul>
      </section>
    </article>
  );
}

/* ───────────── Spacing ───────────── */
export function Spacing() {
  const space = [[1, 4], [2, 8], [3, 12], [4, 16], [5, 20], [6, 24], [8, 32], [10, 40], [12, 48]];
  const radii = [["rounded-xs", "4px", "Chips inside inputs, kbd"], ["rounded-sm", "6px", "Small buttons, menu items"], ["rounded-md", "8px", "Buttons, inputs, cards"], ["rounded-lg", "12px", "Cards, popovers"], ["rounded-xl", "16px", "Composer, dialogs, panels"], ["rounded-full", "9999px", "Pills, avatars"]];
  const heights = [["xs", 28], ["sm", 32], ["md", 36], ["lg", 40]];
  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Foundations" title="Spacing & Radius" lead="Everything sits on a 4px grid. Controls come in four heights, corners in six radii, and elevation in four shadows." />
      <section className="space-y-4">
        <H2 id="spacing">Spacing</H2>
        <div className="space-y-2 rounded-lg border border-border p-5">
          {space.map(([k, px]) => (
            <div key={k} className="flex items-center gap-4 text-sm">
              <code className="w-10 font-mono text-xs text-fg-muted">{k}</code>
              <span className="w-12 font-mono text-xs text-fg-subtle">{px}px</span>
              <span className="h-4 rounded-xs bg-fg/80" style={{ width: px * 4 }} />
            </div>
          ))}
        </div>
        <P>Rule of thumb: 4–8 inside components, 12–16 between related items, 24–32 between groups, 48 between sections.</P>
      </section>
      <section className="space-y-4">
        <H2 id="heights">Control heights</H2>
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-border p-5">
          {heights.map(([n, h]) => (
            <div key={n} className="text-center">
              <div className="grid place-items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg" style={{ height: Number(h) }}>Button</div>
              <p className="mt-2 font-mono text-xs text-fg-subtle">{n} · {h}px</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <H2 id="radius">Radius</H2>
        <div className="grid gap-4 sm:grid-cols-3">
          {radii.map(([c, v, u]) => (
            <div key={c} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <span className={cn("size-12 shrink-0 border-2 border-fg/70 bg-surface-2", c)} />
              <div><code className="font-mono text-sm text-fg">{c}</code><p className="text-xs text-fg-subtle">{v} · {u}</p></div>
            </div>
          ))}
        </div>
        <P>Nested corners: inner radius = outer radius − padding. A 16px composer with 8px padding holds 8px buttons.</P>
      </section>
      <section className="space-y-4">
        <H2 id="elevation">Elevation</H2>
        <div className="grid gap-6 rounded-lg bg-surface p-6 sm:grid-cols-4">
          {[["shadow-xs", "Inputs"], ["shadow-sm", "Cards, composer"], ["shadow-md", "Focused composer"], ["shadow-lg", "Menus, dialogs, toasts"]].map(([c, u]) => (
            <div key={c} className={cn("rounded-lg bg-bg p-4", c)}>
              <code className="font-mono text-sm text-fg">{c}</code>
              <p className="text-xs text-fg-subtle">{u}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

/* ───────────── Theme builder ───────────── */
const rgbToHex = (rgb: string) => (rgb ? "#" + rgb.split(" ").map((x) => Number(x).toString(16).padStart(2, "0")).join("") : "");
const hexToRgb = (h: string) => { const n = parseInt(h.replace("#", ""), 16); return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`; };
const lighten = (h: string, amt: number) => {
  const n = parseInt(h.replace("#", ""), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amt);
  return `${mix((n >> 16) & 255)} ${mix((n >> 8) & 255)} ${mix(n & 255)}`;
};
const luminance = (rgb: string) => { const [r, g, b] = rgb.split(" ").map((x) => { const c = Number(x) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const onColor = (rgb: string) => (luminance(rgb) > 0.4 ? "10 10 10" : "255 255 255");
function luminanceOf(rgb: string) { return luminance(rgb); }

const radii = {
  Sharp: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
  Default: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16 },
  Round: { xs: 6, sm: 8, md: 12, lg: 16, xl: 24 },
};
const fonts = {
  Geist: '"Geist", ui-sans-serif, system-ui, sans-serif',
  Inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  System: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
};
const presets = [{ name: "Neutral", hex: "" }, { name: "Blue", hex: "#2563eb" }, { name: "Violet", hex: "#7c3aed" }, { name: "Emerald", hex: "#059669" }, { name: "Orange", hex: "#ea580c" }, { name: "Rose", hex: "#e11d48" }];

export function ThemeBuilder() {
  const [hex, setHex] = React.useState(() => { const d = document.documentElement.dataset; return d.brand === "custom" ? rgbToHex(d.accentLight ?? "") : brands.find((b) => b.name === d.brand && b.name !== "Neutral") ? "" : ""; });
  const [radius, setRadius] = React.useState<keyof typeof radii>("Default");
  const [font, setFont] = React.useState<keyof typeof fonts>("Geist");

  const light = hex ? hexToRgb(hex) : "23 23 23";
  const dark = hex ? lighten(hex, 0.25) : "237 237 237";
  const r = radii[radius];

  React.useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const acc = isDark ? dark : light;
    if (hex) { root.dataset.accentLight = light; root.dataset.accentDark = dark; root.style.setProperty("--accent", acc); root.style.setProperty("--accent-fg", onColor(acc)); root.dataset.brand = "custom"; }
    else { root.style.removeProperty("--accent"); root.style.removeProperty("--accent-fg"); root.dataset.brand = "Neutral"; }
    (Object.keys(r) as (keyof typeof r)[]).forEach((k) => root.style.setProperty(`--radius-${k}`, `${r[k]}px`));
    root.style.setProperty("--font-sans", fonts[font]);
  }, [hex, radius, font, light, dark, r]);

  const css = `:root {
  --accent: ${light};
  --accent-fg: ${onColor(light)};
  --radius-xs: ${r.xs}px;
  --radius-sm: ${r.sm}px;
  --radius-md: ${r.md}px;
  --radius-lg: ${r.lg}px;
  --radius-xl: ${r.xl}px;
  --font-sans: ${fonts[font]};
}
.dark {
  --accent: ${dark};
  --accent-fg: ${onColor(dark)};
}`;

  const Opt = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors", on ? "border-fg text-fg" : "border-border text-fg-muted hover:text-fg")}>{children}</button>
  );

  return (
    <article className="space-y-12">
      <PageHeader eyebrow="Foundations" title="Theme Builder" lead="Pick an accent, corner style and font. The whole site updates live — then copy the CSS into tokens.css." />
      <section className="space-y-6">
        <H2 id="accent">Accent</H2>
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p) => (
            <Opt key={p.name} on={hex === p.hex} onClick={() => setHex(p.hex)}>
              <span className="size-4 rounded-full ring-1 ring-inset ring-fg/10" style={{ background: p.hex || "rgb(23 23 23)" }} />{p.name}
            </Opt>
          ))}
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-fg-muted hover:text-fg">
            <input type="color" value={hex || "#171717"} onChange={(e) => setHex(e.target.value)} className="size-5 cursor-pointer rounded-full border-0 bg-transparent p-0" aria-label="Custom accent colour" />Custom
          </label>
        </div>
        <H2 id="radius">Corners</H2>
        <div className="flex flex-wrap gap-2">{(Object.keys(radii) as (keyof typeof radii)[]).map((k) => <Opt key={k} on={radius === k} onClick={() => setRadius(k)}><span className="size-4 border-2 border-current" style={{ borderRadius: radii[k].sm }} />{k}</Opt>)}</div>
        <H2 id="font">Font</H2>
        <div className="flex flex-wrap gap-2">{(Object.keys(fonts) as (keyof typeof fonts)[]).map((k) => <Opt key={k} on={font === k} onClick={() => setFont(k)}><span style={{ fontFamily: fonts[k] }}>Aa</span>{k}</Opt>)}</div>
      </section>
      <section className="space-y-4">
        <H2 id="preview">Preview</H2>
        <div className="grid gap-4 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-border bg-bg p-5">
            <p className="text-base font-semibold text-fg">Upgrade to Pro</p>
            <p className="text-sm text-fg-muted">Unlimited messages and every model.</p>
            <div className="flex gap-2"><span className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg">Upgrade</span><span className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium text-fg">Later</span></div>
          </div>
          <div className="space-y-3 rounded-lg border border-border bg-bg p-5">
            <div className="h-9 rounded-md border border-border px-3 text-sm leading-9 text-fg-subtle">Ask anything…</div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2"><div className="h-full w-2/3 rounded-full bg-accent" /></div>
            <div className="flex gap-2"><span className="inline-flex h-5 items-center rounded-full bg-accent px-2 text-2xs font-medium text-accent-fg">New</span><span className="inline-flex h-5 items-center rounded-full bg-surface-2 px-2 text-2xs font-medium text-fg-muted">Beta</span></div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <H2 id="css">Your theme</H2>
        <P>Paste this at the end of <code>tokens.css</code>. Accent text colour is picked automatically for contrast.</P>
        <Code code={css} lang="css" filename="tokens.css (overrides)" />
      </section>
    </article>
  );
}
