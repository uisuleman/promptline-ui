import * as React from "react";
import { ArrowRight, Check, Copy, Globe, Sparkles, Terminal, BookOpen, Braces, Bot, TextCursorInput, MessageCircleQuestion, Brain, ShieldCheck, Gauge, GitCompare, MessagesSquare, Workflow, LayoutDashboard, Wand2, Blocks, Ruler, Type, Square, MousePointerClick, Lightbulb, Paperclip } from "lucide-react";
import { registry, sections } from "../registry";
import { docPages, hrefFor } from "../lib";
import {
  PromptInput, PromptTool, ModelSelector, Reasoning, Tool, Confirmation, UsageMeter, StatusBanner, DiffView, diffLines,
  ClarifyingQuestion, Attachments, Message, AssistantAvatar, Badge, ButtonLink, useCopy, cn,
  type ConfirmationState, type HunkDecision, type PromptStatus,
} from "../../src";

function Showcase({ title, slug, icon, className, children }: { title: string; slug: string; icon: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("group flex flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-sm", className)}>
      <div className="flex flex-1 items-center justify-center bg-bg p-4 sm:p-6">{children}</div>
      <a href={`#/components/${slug}`} className="flex h-12 items-center gap-2.5 border-t border-border px-3 text-sm font-medium text-fg transition-colors hover:bg-surface">
        <span className="grid size-7 place-items-center rounded-md border border-border bg-surface text-fg-muted [&_svg]:size-3.5">{icon}</span>
        {title}<ArrowRight className="ml-auto size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

/* Static prompt mock with measurement callouts */
function SpecPrompt() {
  const tag = "absolute rounded-xs bg-info px-1 font-mono text-2xs leading-4 text-white";
  return (
    <div className="relative">
      <div className="relative rounded-xl border border-border bg-bg shadow-sm outline-dashed outline-1 outline-offset-4 outline-info/50">
        <div className="relative mx-4 mt-4 h-6 text-md text-fg-subtle"><span className="absolute inset-0 bg-info/10" />Ask anything…</div>
        <div className="flex items-center gap-1 p-2 pt-4">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-sm text-fg-muted"><Globe className="size-3.5" />Search</span>
          <span className="relative ml-auto grid size-8 place-items-center rounded-full bg-fg text-bg outline-dashed outline-1 outline-offset-2 outline-info/70"><ArrowRight className="size-3.5 -rotate-90" /></span>
        </div>
      </div>
      <span className={cn(tag, "-top-6 left-0")}>r 16</span>
      <span className={cn(tag, "left-4 top-[18px] -translate-y-full")}>15/24</span>
      <span className={cn(tag, "-bottom-6 right-0")}>32 × 32</span>
      <span className={cn(tag, "-left-1 top-1/2 -translate-x-full -translate-y-1/2 hidden sm:block")}>16</span>
    </div>
  );
}

/* ---------- Live demos for the showcase ---------- */
function DemoPrompt() {
  const [v, setV] = React.useState("");
  const [status, setStatus] = React.useState<PromptStatus>("ready");
  const [model, setModel] = React.useState("pro");
  const [search, setSearch] = React.useState(true);
  const [files, setFiles] = React.useState([{ id: "1", name: "q3-pricing.pdf", size: 248000, type: "application/pdf", status: "ready" as const }]);
  return (
    <div className="w-full max-w-xl">
      <PromptInput
        value={v}
        onValueChange={setV}
        status={status}
        onStop={() => setStatus("ready")}
        onSubmit={() => { setV(""); setStatus("submitted"); setTimeout(() => setStatus("streaming"), 700); setTimeout(() => setStatus("ready"), 3000); }}
        placeholder="Compare our pricing with the top 3 competitors…"
        attachments={files.length ? <Attachments items={files} onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))} /> : undefined}
        tools={<>
          <PromptTool icon={<Paperclip />} onClick={() => setFiles([{ id: "1", name: "q3-pricing.pdf", size: 248000, type: "application/pdf", status: "ready" }])} />
          <PromptTool icon={<Globe />} active={search} onClick={() => setSearch((s) => !s)}>Search</PromptTool>
          <ModelSelector models={[{ id: "fast", name: "Swift", description: "Fast answers" }, { id: "pro", name: "Swift Pro", description: "Deeper reasoning" }]} value={model} onValueChange={setModel} />
        </>}
      />
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {["Summarize this PDF", "Draft a launch email"].map((t) => (
          <button key={t} type="button" onClick={() => setV(t)} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-bg px-3 text-xs text-fg-muted transition-colors hover:bg-surface hover:text-fg"><Sparkles className="size-3" />{t}</button>
        ))}
      </div>
    </div>
  );
}

function DemoAgent() {
  return (
    <div className="w-full max-w-md">
      <Message from="assistant" className="max-sm:[&>div:first-child]:hidden" avatar={<AssistantAvatar />} header={<><Reasoning duration={6}><p>Checking the pricing pages first.</p></Reasoning><Tool name="web_search" title="Web search" state="completed" icon={<Globe />} /></>}>
        Most competitors charge per seat. Two offer usage-based plans.
      </Message>
    </div>
  );
}

function DemoConfirm() {
  const [s, setS] = React.useState<ConfirmationState>("pending");
  return (
    <div className="w-full max-w-sm space-y-2">
      <Confirmation title="Send email to 248 customers?" details={[{ label: "Subject", value: "Your dashboard just got faster" }]} risk="high" state={s} approveLabel="Send" onApprove={() => setS("approved")} onDeny={() => setS("denied")} />
      {s !== "pending" && <button type="button" onClick={() => setS("pending")} className="text-xs text-fg-subtle underline underline-offset-4">Reset</button>}
    </div>
  );
}

function DemoLimits() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <UsageMeter used={46} limit={50} label="Messages today" resetText="Resets in 6h" onUpgrade={() => {}} />
      <StatusBanner kind="rate-limit" countdown={18} onAction={() => {}} />
    </div>
  );
}

const hunks = [{ id: "a", header: "@@ api/chat/route.ts", lines: diffLines("const res = await generate(input);\nreturn Response.json(res);", "const res = stream(input);\nreturn res.toResponse();") }];
function DemoDiff() {
  const [d, setD] = React.useState<Record<string, HunkDecision>>({});
  return <DiffView className="w-full max-w-lg" filename="route.ts" hunks={hunks} decisions={d} onDecide={(id, v) => setD(v ? { [id]: v } : {})} />;
}

function DemoQuestion() {
  const [a, setA] = React.useState<string[]>();
  const opts = [{ value: "deck", label: "Slide deck", recommended: true }, { value: "memo", label: "One-page memo" }, { value: "sheet", label: "Spreadsheet" }];
  return (
    <div className="w-full max-w-sm space-y-2">
      <ClarifyingQuestion question="Which format should I use?" options={opts} allowOther={false} answered={a} onAnswer={({ values }) => setA(values.map((v) => opts.find((o) => o.value === v)!.label))} />
      {a && <button type="button" onClick={() => setA(undefined)} className="text-xs text-fg-subtle underline underline-offset-4">Reset</button>}
    </div>
  );
}

const groupIcons: Record<string, React.ReactNode> = { Chat: <MessagesSquare />, Agents: <Workflow />, "Product states": <LayoutDashboard />, "Beyond chat": <Wand2 /> };

/* ---------- Page ---------- */
export function Home() {
  const count = (id: string) => registry.filter((r) => r.section === id).length;
  const aiGroups = sections.find((s) => s.id === "ai")!.groups;
  const newest = registry.filter((r) => r.isNew).length;

  return (
    <div className="overflow-x-clip">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative isolate flex flex-col items-center py-20 text-center sm:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-[-50vw] inset-y-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_45%_55%_at_50%_35%,#000_10%,transparent_70%)]"
          style={{ backgroundImage: "linear-gradient(rgb(var(--border) / 0.7) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--border) / 0.7) 1px, transparent 1px)", backgroundSize: "64px 64px", backgroundPosition: "center top" }} />
        <a href="#/docs/changelog" className="group mb-8 inline-flex h-8 items-center gap-2 rounded-full border border-border bg-bg py-1 pl-1 pr-3 text-sm text-fg-muted shadow-xs transition-colors hover:border-border-strong hover:text-fg">
          <span className="inline-flex h-6 items-center gap-1 rounded-full bg-accent px-2 text-xs font-medium text-accent-fg"><Sparkles className="size-3" />New</span>
          {newest} new components just landed
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
        <h1 className="max-w-4xl text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-fg sm:text-6xl sm:leading-[1.02] lg:text-[72px]">
          Ship AI products<br />
          <span className="bg-gradient-to-b from-fg-muted to-fg-subtle bg-clip-text text-transparent">that feel designed.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-fg-muted">
          {registry.length} free, open-source components for chat, agents and everything around them — built with React and Tailwind CSS, with the design reasoning behind every one.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="#/components" size="lg">Browse components<ArrowRight /></ButtonLink>
          <ButtonLink href="#/docs/introduction" size="lg" variant="outline">Read the docs</ButtonLink>
        </div>
      </section>

      {/* Showcase */}
      <section aria-label="Component showcase" className="relative overflow-hidden rounded-3xl border border-border bg-surface p-2 sm:p-4">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(rgb(var(--border-strong)) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-fg/[0.06] blur-3xl" />
        <div className="relative grid gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Showcase title="Prompt Input" slug="prompt-input" icon={<TextCursorInput />} className="md:col-span-2 lg:col-span-4"><DemoPrompt /></Showcase>
          <Showcase title="Clarifying Question" slug="clarifying-question" icon={<MessageCircleQuestion />} className="lg:col-span-2"><DemoQuestion /></Showcase>
          <Showcase title="Reasoning & Tool" slug="reasoning" icon={<Brain />} className="lg:col-span-3"><DemoAgent /></Showcase>
          <Showcase title="Confirmation" slug="confirmation" icon={<ShieldCheck />} className="lg:col-span-3"><DemoConfirm /></Showcase>
          <Showcase title="Usage Meter & Status Banner" slug="status-banner" icon={<Gauge />} className="lg:col-span-2"><DemoLimits /></Showcase>
          <Showcase title="Diff View" slug="diff-view" icon={<GitCompare />} className="md:col-span-2 lg:col-span-4"><DemoDiff /></Showcase>
        </div>
      </section>

      {/* Beyond the chat */}
      <section className="grid gap-10 py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium text-fg-subtle">Coverage</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg">Everything around the chat, too</h2>
          <p className="mt-3 text-lg text-fg-muted">Most kits stop at messages. Real AI products also need limits, paywalls, approvals, memory and AI outside the chat window.</p>
          <a href="#/components" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fg underline-offset-4 hover:underline">Explore all {registry.length} components<ArrowRight className="size-4" /></a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {aiGroups.map((g) => {
            const items = registry.filter((r) => r.section === "ai" && r.group === g);
            return (
              <div key={g} className="rounded-xl border border-border p-5">
                <p className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-md border border-border bg-surface text-fg [&_svg]:size-4">{groupIcons[g]}</span><span className="text-base font-semibold text-fg">{g}</span><span className="ml-auto text-sm tabular-nums text-fg-subtle">{items.length}</span></p>
                <p className="mt-2 text-sm text-fg-muted">{items.slice(0, 5).map((i) => i.name).join(", ")}{items.length > 5 && "…"}</p>
              </div>
            );
          })}
          <div className="rounded-xl border border-dashed border-border-strong p-5 sm:col-span-2">
            <p className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-md border border-border bg-surface text-fg [&_svg]:size-4"><Blocks /></span><span className="text-base font-semibold text-fg">UI components</span><span className="ml-auto text-sm tabular-nums text-fg-subtle">{count("ui")}</span></p>
            <p className="mt-2 text-sm text-fg-muted">Buttons, forms, menus, dialogs, tabs and a full data table — the building blocks, built to the same standard.</p>
          </div>
        </div>
      </section>

      {/* Design notes */}
      <section className="border-t border-border py-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-fg-subtle">Design specs</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg">Every component explains itself</h2>
            <p className="mt-3 text-lg text-fg-muted">Exact sizes, type and the reasoning behind each decision — so you can change the look without breaking what makes it work.</p>
          </div>
          <a href="#/components/prompt-input" className="inline-flex items-center gap-1.5 text-sm font-medium text-fg underline-offset-4 hover:underline">See the full page<ArrowRight className="size-4" /></a>
        </div>
        <div className="mt-10 grid overflow-hidden rounded-2xl border border-border lg:grid-cols-[1.15fr_1fr]">
          <div className="relative flex flex-col justify-center gap-10 border-b border-border bg-surface p-6 sm:p-10 lg:border-b-0 lg:border-r">
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(rgb(var(--border-strong)) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
            <div className="relative mx-auto w-full max-w-lg px-2 pt-6 sm:px-6">
              <SpecPrompt />
            </div>
            <dl className="relative grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              {[
                { i: <Square />, k: "Radius", v: "16px" },
                { i: <Type />, k: "Text", v: "15 / 24" },
                { i: <Ruler />, k: "Padding", v: "16px" },
                { i: <MousePointerClick />, k: "Send", v: "32px" },
              ].map((x) => (
                <div key={x.k} className="bg-bg px-3 py-2.5">
                  <dt className="flex items-center gap-1.5 text-xs text-fg-subtle [&_svg]:size-3">{x.i}{x.k}</dt>
                  <dd className="mt-0.5 font-mono text-sm text-fg">{x.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ol className="divide-y divide-border bg-bg">
            {registry.find((r) => r.slug === "prompt-input")!.notes.slice(0, 4).map((n, i) => (
              <li key={i} className="flex gap-4 p-5 sm:p-6">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-surface font-mono text-xs text-fg-muted">{i + 1}</span>
                <p className="text-base text-fg">{n}</p>
              </li>
            ))}
            <li className="flex items-center gap-2 px-5 py-4 text-sm text-fg-muted sm:px-6"><Lightbulb className="size-4" />Notes ship inside every registry item.</li>
          </ol>
        </div>
      </section>

      {/* AI tools */}
      <section className="border-t border-border py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fg-subtle">Install your way</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg">Built for people and their AI tools</h2>
          <p className="mt-3 text-lg text-fg-muted">Copy the code, run one command, or let your AI assistant install it — with the design rules included.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: <Sparkles />, t: "Copy a prompt", d: "One click copies the component, its dependencies, tokens and design rules. Paste into Lovable, Bolt, v0 or Cursor.", href: "#/docs/ai-tools" },
            { icon: <Terminal />, t: "shadcn CLI", d: "Every component is a registry item. Add the @promptline namespace and install by name.", href: "#/docs/ai-tools" },
            { icon: <Bot />, t: "MCP & llms.txt", d: "Claude, Cursor and Windsurf can search, read and install components through the shadcn MCP server.", href: "#/docs/ai-tools" },
          ].map((c) => (
            <a key={c.t} href={c.href} className="group rounded-xl border border-border p-6 transition-colors hover:border-border-strong hover:bg-surface">
              <span className="grid size-9 place-items-center rounded-md border border-border bg-bg text-fg shadow-xs [&_svg]:size-4">{c.icon}</span>
              <p className="mt-4 text-base font-semibold text-fg">{c.t}</p>
              <p className="mt-1 text-sm text-fg-muted">{c.d}</p>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate mb-20 overflow-hidden rounded-3xl bg-fg px-6 py-20 text-center text-bg sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_20%,transparent_80%)]"
          style={{ backgroundImage: "linear-gradient(rgb(var(--bg)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--bg)) 1px, transparent 1px)", backgroundSize: "48px 48px", backgroundPosition: "center top" }} />
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-64 w-2/3 -translate-x-1/2 rounded-full bg-bg/10 blur-3xl" />
        <h2 className="mx-auto max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">Make your AI product feel designed</h2>
        <p className="mx-auto mt-4 max-w-md text-balance text-lg text-bg/60">{registry.length} components, free and open source forever. Copy what you need — it's your code.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#/components" className="inline-flex h-10 items-center gap-2 rounded-md bg-bg px-4 text-sm font-medium text-fg transition-opacity hover:opacity-90">Browse components<ArrowRight className="size-4" /></a>
          <a href="#/docs/installation" className="inline-flex h-10 items-center gap-2 rounded-md border border-bg/20 px-4 text-sm font-medium text-bg transition-colors hover:bg-bg/10"><BookOpen className="size-4" />Get started</a>
        </div>
      </section>
    </div>
    </div>
  );
}

export function SiteFooter() {
  const col = (title: string, links: [string, string][]) => (
    <div>
      <p className="text-sm font-semibold text-fg">{title}</p>
      <ul className="mt-3 space-y-2">{links.map(([h, t]) => <li key={h}><a href={h} className="text-sm text-fg-muted transition-colors hover:text-fg">{t}</a></li>)}</ul>
    </div>
  );
  const pick = (id: string, n: number) => registry.filter((r) => r.section === id).slice(0, n).map((r) => [hrefFor(r), r.name] as [string, string]);
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <a href="#/" className="flex items-center gap-2 text-base font-semibold text-fg">
            <span className="grid size-6 place-items-center rounded-sm bg-fg text-bg"><svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden><path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13 6.4 8.6 2 7l4.4-1.6z" /></svg></span>
            Promptline UI
          </a>
          <p className="mt-3 max-w-xs text-sm text-fg-muted">Free, open-source UI for AI products.</p>
          <p className="mt-6 flex items-center gap-2 text-xs text-fg-subtle"><Braces className="size-3.5" />MIT licensed</p>
        </div>
        {col("Docs", docPages.filter((p) => ["introduction", "installation", "usage", "ai-tools", "theme"].includes(p.id)).map((p) => [hrefFor(p), p.title]))}
        {col("AI components", [...pick("ai", 5), ["#/components", `All ${registry.length} →`]])}
        {col("UI components", [...pick("ui", 5), ["#/components", "View all →"]])}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-6 text-center text-sm text-fg-subtle sm:px-6 md:grid-cols-3 md:text-left">
          <p>© {new Date().getFullYear()} Promptline UI. All rights reserved.</p>
          <p className="md:text-center">Made with <span role="img" aria-label="love">❤️</span> by <a href="https://x.com/uisuleman" target="_blank" rel="noreferrer" className="font-medium text-fg underline-offset-4 hover:underline">uisuleman</a></p>
          <nav aria-label="Legal" className="flex justify-center gap-5 md:justify-end">
            <a href="#/privacy" className="transition-colors hover:text-fg">Privacy Policy</a>
            <a href="#/terms" className="transition-colors hover:text-fg">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
