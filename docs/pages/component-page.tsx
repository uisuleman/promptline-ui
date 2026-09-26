import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Sparkles, Terminal } from "lucide-react";
import { registry, type Entry } from "../registry";
import { demos } from "../generated/demos";
import { META, H2, H3, P, Code, CopyButton, PreviewBlock, hrefFor, propHints, sourceOf } from "../lib";
import { Badge, Kbd, Tabs, cn } from "../../src";

const title = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2");
export { REGISTRY_URL } from "../site";
import { REGISTRY_URL } from "../site";

const depsOf = (e: Entry) => {
  const f = META.files[e.file!];
  return ["lucide-react", ...f.npm].filter((v, i, a) => a.indexOf(v) === i && v !== "react-dom");
};

export function buildPrompt(e: Entry) {
  const f = META.files[e.file!];
  const files = [...f.files, e.file!];
  return [
    `Add the "${e.name}" component from Promptline UI to this project (React + Tailwind CSS).`,
    ``,
    `Setup (skip any step that's already done):`,
    `1. Install: npm i ${depsOf(e).join(" ")}`,
    `2. Create src/styles/tokens.css with the content below and import it once in the global CSS, right after the Tailwind import.`,
    `3. Create tailwind.preset.js with the content below. Tailwind v3: add presets: [require("./tailwind.preset.js")] to tailwind.config. Tailwind v4 (no config file): create tailwind.config.js with module.exports = { presets: [require("./tailwind.preset.js")] } and add @config "<relative path>/tailwind.config.js"; to the global CSS.`,
    `4. Next.js App Router: keep the "use client" line at the top of the component files.`,
    ``,
    `Then create each file below at the given path with exactly this content. Keep the code and class names as they are — do not restyle. Adjust import paths only if the project uses a different folder structure.`,
    ``,
    `--- src/styles/tokens.css ---`, META.shared["styles/tokens.css"],
    `--- tailwind.preset.js ---`, META.shared["tailwind.preset.js"],
    ...files.flatMap((p) => [`--- src/${p} ---`, sourceOf(p)]),
    `Design rules for this component:`,
    ...(e.notes ?? []).map((n) => `- ${n}`),
    ``,
    `Usage example:`,
    META.demos[e.slug]?.[0]?.code ?? "",
  ].join("\n");
}

function Installation({ e }: { e: Entry }) {
  const [tab, setTab] = React.useState<"prompt" | "cli" | "manual">("prompt");
  const f = META.files[e.file!];
  const prompt = React.useMemo(() => buildPrompt(e), [e]);
  return (
    <div>
      <div className="border-b border-border">
        <Tabs variant="underline" size="sm" value={tab} onValueChange={(v) => setTab(v as typeof tab)} items={[
          { value: "prompt", label: "AI prompt", icon: <Sparkles /> },
          { value: "cli", label: "CLI", icon: <Terminal /> },
          { value: "manual", label: "Manual" },
        ]} />
      </div>
      {tab === "prompt" && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-5">
          <p className="text-base font-medium text-fg">For Lovable, Bolt, v0, Cursor or Claude</p>
          <P className="mt-1">One prompt with the code, its {f.files.length} dependencies, the design tokens and this page's design rules. Paste it into your AI tool.</P>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <CopyButton text={prompt} label="Copy prompt" className="h-9 border-accent bg-accent px-4 text-accent-fg hover:bg-accent/85" />
            <span className="text-xs text-fg-subtle">{(prompt.length / 1000).toFixed(1)}K characters · {f.files.length + 1} files</span>
          </div>
        </div>
      )}
      {tab === "cli" && (
        <div className="mt-4 space-y-3">
          <Code code={`npx shadcn@latest add ${REGISTRY_URL}/${e.slug}.json`} lang="bash" />
          <P>Installs the file, its dependencies and the shared primitives in one step. Works once the registry is hosted — see <a href="#/docs/ai-tools" className="font-medium text-fg underline underline-offset-4">AI Tools & MCP</a>.</P>
        </div>
      )}
      {tab === "manual" && (
        <ol className="mt-4 space-y-6">
          <Step n={1} title="Install dependencies"><Code code={`npm i ${depsOf(e).join(" ")}`} lang="bash" /></Step>
          <Step n={2} title="Add the foundations"><P>If you haven't already, add <code>tokens.css</code> and the Tailwind preset — see <a href="#/docs/installation" className="font-medium text-fg underline underline-offset-4">Installation</a>.</P></Step>
          {f.files.length > 0 && (
            <Step n={3} title="Copy the files it depends on">
              <div className="flex flex-wrap gap-1.5">
                {f.files.map((p) => {
                  const target = registry.find((r) => r.file === p);
                  return target ? <a key={p} href={hrefFor(target)} className="rounded-sm border border-border bg-surface px-2 py-1 font-mono text-xs text-fg hover:border-border-strong">{p}</a> : <span key={p} className="rounded-sm border border-border bg-surface px-2 py-1 font-mono text-xs text-fg-muted">{p}</span>;
                })}
              </div>
            </Step>
          )}
          <Step n={f.files.length ? 4 : 3} title={`Copy src/${e.file}`}><Code code={f.source} filename={`src/${e.file}`} maxHeight={420} /></Step>
        </ol>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-10">
      <span className="absolute left-0 top-0 grid size-6 place-items-center rounded-full border border-border bg-surface text-xs font-semibold text-fg">{n}</span>
      <p className="mb-3 text-base font-medium text-fg">{title}</p>
      {children}
    </li>
  );
}

function ApiTable({ name, file }: { name: string; file: string }) {
  const info = META.files[file]?.props[name];
  if (!info) return null;
  return (
    <div className="space-y-3">
      <H3><code className="font-mono text-base">{`<${name} />`}</code></H3>
      {info.props.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-surface text-xs text-fg-muted"><tr><th className="h-10 px-4 font-medium">Prop</th><th className="h-10 px-4 font-medium">Type</th><th className="h-10 px-4 font-medium">Default</th></tr></thead>
            <tbody className="divide-y divide-border">
              {info.props.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="px-4 py-3">
                    <code className="font-mono text-sm font-medium text-fg">{p.name}{p.required ? "" : "?"}</code>
                    {(p.description || propHints[p.name]) && <p className="mt-1 max-w-xs text-xs text-fg-muted">{p.description || propHints[p.name]}</p>}
                  </td>
                  <td className="px-4 py-3"><code className="break-words font-mono text-xs text-[rgb(var(--syn-fn))]">{p.type}</code></td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-fg-muted">{p.default ?? "—"}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <P>No props.</P>}
      {info.extends.length > 0 && <P>Also accepts all props of <code>{info.extends.join(", ")}</code>.</P>}
    </div>
  );
}

export function ComponentPage({ e }: { e: Entry }) {
  const f = META.files[e.file!];
  const blocks = META.demos[e.slug] ?? [];
  const mod = demos[e.slug] ?? {};
  const [first, ...rest] = blocks;
  const idx = registry.indexOf(e);
  const prev = registry[idx - 1], next = registry[idx + 1];
  const wide = ["conversation", "chat-sidebar", "web-preview", "artifact", "data-table", "diff-view", "response-compare"].includes(e.slug);
  const crumb = e.section === "ui" ? "UI components" : "AI components";

  return (
    <article className="min-w-0 space-y-12">
      <header>
        <p className="text-sm text-fg-subtle">{crumb} <span className="mx-1">/</span> {e.group}</p>
        <h1 className="mt-2 flex items-center gap-3 text-4xl font-semibold text-fg">{e.name}{e.isNew && <Badge tone="info">New</Badge>}</h1>
        <p className="mt-3 max-w-2xl text-lg text-fg-muted">{e.description}</p>
      </header>

      {first && mod[first.name] && <PreviewBlock demo={mod[first.name]} code={first.code} padded={!wide} minHeight={wide ? 360 : 320} />}

      {e.features && e.features.length > 0 && (
        <section className="space-y-4">
          <H2 id="features">Features</H2>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {e.features.map((x) => <li key={x} className="flex gap-2 text-base text-fg-muted"><Check className="mt-0.5 size-4 shrink-0 text-fg" />{x}</li>)}
          </ul>
        </section>
      )}

      <section className="space-y-6"><H2 id="installation">Installation</H2><Installation e={e} /></section>

      {(
        <section className="space-y-4">
          <H2 id="usage">Usage</H2>
          <Code code={`import { ${e.api.join(", ")} } from "@/${e.file!.replace(/\.tsx$/, "")}";`} />
          {first && <Code code={first.code} maxHeight={360} />}
        </section>
      )}

      {rest.length > 0 && (
        <section className="space-y-10">
          <H2 id="examples">Examples</H2>
          {rest.map((d) => mod[d.name] && (
            <div key={d.name} className="space-y-4">
              <H3 id={`ex-${d.name}`}>{title(d.name)}</H3>
              <PreviewBlock demo={mod[d.name]} code={d.code} padded={!wide} minHeight={200} />
            </div>
          ))}
        </section>
      )}

      <section className="space-y-6">
        <H2 id="design-notes">Design notes</H2>
        <ol className="space-y-3">
          {e.notes.map((n, i) => (
            <li key={i} className="flex gap-4 rounded-lg border border-border bg-surface p-4">
              <span className="font-mono text-xs leading-6 text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-base text-fg [&_code]:font-mono [&_code]:text-sm">{n.split(/`([^`]+)`/).map((s, j) => (j % 2 ? <code key={j}>{s}</code> : s))}</p>
            </li>
          ))}
        </ol>
        {e.keyboard && (
          <div className="space-y-3">
            <H3 id="keyboard">Keyboard</H3>
            <div className="overflow-hidden rounded-lg border border-border">
              {e.keyboard.map(([k, a]) => (
                <div key={k} className="flex h-11 items-center justify-between border-b border-border px-4 text-sm last:border-0">
                  <span className="flex gap-1">{k.split(/ \+ | \/ /).map((x) => <Kbd key={x}>{x}</Kbd>)}</span>
                  <span className="text-fg-muted">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {<section className="space-y-8"><H2 id="api">API reference</H2>{e.api.map((n) => <ApiTable key={n} name={n} file={e.file!} />)}</section>}

      <nav className="grid grid-cols-2 gap-4 border-t border-border pt-8" aria-label="Pagination">
        {prev ? <PageLink href={hrefFor(prev)} label="Previous" name={prev.name} dir="prev" /> : <span />}
        {next ? <PageLink href={hrefFor(next)} label="Next" name={next.name} dir="next" /> : <span />}
      </nav>
    </article>
  );
}

export function PageLink({ href, label, name, dir }: { href: string; label: string; name: string; dir: "prev" | "next" }) {
  return (
    <a href={href} className={cn("group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface", dir === "next" && "items-end text-right")}>
      <span className="text-xs text-fg-subtle">{label}</span>
      <span className="inline-flex items-center gap-1 text-base font-medium text-fg">
        {dir === "prev" && <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />}{name}
        {dir === "next" && <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
      </span>
    </a>
  );
}
