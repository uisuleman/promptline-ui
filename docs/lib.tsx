import * as React from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import meta from "./generated/meta.json";
import { registry, type Entry } from "./registry";
import { cn, useCopy, CodeBlock, Tooltip } from "../src";

type FileMeta = {
  source: string; files: string[]; npm: string[];
  props: Record<string, { props: { name: string; type: string; required: boolean; default?: string; description: string }[]; extends: string[] }>;
};
export type Meta = {
  files: Record<string, FileMeta>;
  demos: Record<string, { name: string; code: string }[]>;
  shared: Record<string, string>;
};
/** Source text for any path under src/ */
export const sourceOf = (p: string) => META.shared[p] ?? META.files[p]?.source ?? "";
export const META = meta as unknown as Meta;

/* ---------- routing ---------- */
export type Route = { kind: "home" } | { kind: "notfound" } | { kind: "legal"; id: "privacy" | "terms" } | { kind: "doc"; id: string } | { kind: "component"; entry: Entry } | { kind: "components" };
export const docPages = [
  { id: "introduction", title: "Introduction", section: "Overview" },
  { id: "why", title: "Why Promptline", section: "Overview" },
  { id: "changelog", title: "Changelog", section: "Overview" },
  { id: "installation", title: "Installation", section: "Usage" },
  { id: "usage", title: "Usage", section: "Usage" },
  { id: "ai-tools", title: "AI Tools & MCP", section: "Usage" },
  { id: "troubleshooting", title: "Troubleshooting", section: "Usage" },
  { id: "colors", title: "Colors", section: "Foundations" },
  { id: "typography", title: "Typography", section: "Foundations" },
  { id: "spacing", title: "Spacing & Radius", section: "Foundations" },
  { id: "theme", title: "Theme Builder", section: "Foundations" },
  { id: "contributing", title: "How to Contribute", section: "Contributing" },
  { id: "new-components", title: "New Components", section: "Contributing" },
  { id: "philosophy", title: "Philosophy", section: "Contributing" },
] as const;
export const docSections = ["Overview", "Usage", "Foundations", "Contributing"] as const;

/** Parse a site path like "/components/prompt-input" into a route. */
export function parsePath(path: string): Route {
  const [, kind, id] = path.replace(/^#/, "").split(/[?#]/)[0].replace(/\/+$/, "").split("/");
  if (kind === "components") {
    if (!id) return { kind: "components" };
    const e = registry.find((r) => r.slug === id);
    return e ? { kind: "component", entry: e } : { kind: "components" };
  }
  if (kind === "privacy" || kind === "terms") return { kind: "legal", id: kind };
  if (kind === "docs") return docPages.some((p) => p.id === id) ? { kind: "doc", id: id! } : { kind: "doc", id: "introduction" };
  return kind ? { kind: "notfound" } : { kind: "home" };
}
/** @deprecated use parsePath */
export const parseHash = parsePath;
export const hrefFor = (r: { slug: string } | { id: string }) => ("slug" in r ? `/components/${r.slug}` : `/docs/${r.id}`);

export const allPages = [
  ...docPages.map((p) => ({ title: p.title, href: hrefFor(p), section: "Docs · " + p.section })),
  ...registry.map((e) => ({ title: e.name, href: hrefFor(e), section: (e.section === "ui" ? "UI · " : "AI · ") + e.group })),
];

/* ---------- router ----------
 * Real URLs (/components/x) on the website. Hash URLs (#/components/x) when the build
 * sets __HASH_ROUTER__ (single-file preview) or the page is opened from file://.
 * Old #/ links are upgraded to real URLs on load. */
declare const __HASH_ROUTER__: boolean;
declare global { var __PL_SSR_PATH__: string | undefined; }
const isBrowser = typeof window !== "undefined";
export const hashMode = () => (typeof __HASH_ROUTER__ !== "undefined" && __HASH_ROUTER__) || (isBrowser && location.protocol === "file:");
const currentPath = () => {
  if (!isBrowser) return globalThis.__PL_SSR_PATH__ ?? "/";
  return hashMode() ? location.hash.slice(1) || "/" : location.pathname;
};

export function navigate(path: string) {
  if (hashMode()) { location.hash = path; return; }
  const [p, anchor] = path.split("#");
  if (p !== location.pathname) history.pushState(null, "", path);
  window.dispatchEvent(new Event("pl:navigate"));
  if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
}

export function useRoute() {
  const [route, setRoute] = React.useState(() => parsePath(currentPath()));
  React.useEffect(() => {
    // Upgrade legacy #/ links to real URLs
    if (!hashMode() && location.hash.startsWith("#/")) { history.replaceState(null, "", location.hash.slice(1)); setRoute(parsePath(location.pathname)); }
    let last = currentPath();
    const on = () => {
      const now = currentPath();
      if (now === last) return;
      last = now;
      setRoute(parsePath(now));
      if (!location.hash || location.hash.startsWith("#/")) { document.getElementById("pl-main")?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); }
    };
    // Intercept internal link clicks so navigation stays instant
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || href.startsWith("//") || a.target || a.hasAttribute("download")) return;
      if (/^\/(r\/|llms|og\.png|robots|sitemap)/.test(href)) return;
      e.preventDefault();
      navigate(href);
    };
    window.addEventListener(hashMode() ? "hashchange" : "popstate", on);
    window.addEventListener("pl:navigate", on);
    document.addEventListener("click", click);
    return () => { window.removeEventListener("hashchange", on); window.removeEventListener("popstate", on); window.removeEventListener("pl:navigate", on); document.removeEventListener("click", click); };
  }, []);
  return route;
}

/* ---------- small docs UI ---------- */
export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} data-toc className="scroll-mt-24 border-b border-border pb-2 text-2xl font-semibold text-fg">{children}</h2>;
}
export function H3({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return <h3 id={id} data-toc={id ? "sub" : undefined} className={cn("scroll-mt-24 text-lg font-semibold text-fg", className)}>{children}</h3>;
}
export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-base text-fg-muted [&_code]:rounded-xs [&_code]:bg-surface-2 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-fg [&_code]:[overflow-wrap:anywhere]", className)}>{children}</p>;
}

export function Code({ code, lang = "tsx", filename, maxHeight, className }: { code: string; lang?: string; filename?: string; maxHeight?: number; className?: string }) {
  return <CodeBlock code={code.trim()} language={lang} filename={filename} maxHeight={maxHeight} className={className} />;
}

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button type="button" onClick={() => copy(text)} className={cn("inline-flex h-8 items-center gap-1.5 rounded-sm border border-border bg-bg px-3 text-sm font-medium text-fg shadow-xs transition-colors hover:bg-surface-2", className)}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: readonly { id: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("flex gap-4", className)}>
      {tabs.map((t) => (
        <button key={t.id} role="tab" type="button" aria-selected={value === t.id} onClick={() => onChange(t.id)}
          className={cn("relative -mb-px inline-flex h-10 items-center gap-1.5 border-b-2 text-sm font-medium transition-colors [&_svg]:size-3.5", value === t.id ? "border-fg text-fg" : "border-transparent text-fg-muted hover:text-fg")}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function PreviewBlock({ demo: Demo, code, minHeight = 320, padded = true }: { demo: () => React.ReactElement; code: string; minHeight?: number; padded?: boolean }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [key, setKey] = React.useState(0);
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border">
        <Tabs tabs={[{ id: "preview", label: "Preview" }, { id: "code", label: "Code" }] as const} value={tab} onChange={setTab} />
        {tab === "preview" && (
          <Tooltip label="Reset demo" align="end"><button type="button" onClick={() => setKey((k) => k + 1)} aria-label="Reset demo" className="grid size-8 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><RotateCcw className="size-3.5" /></button></Tooltip>
        )}
      </div>
      <div className="mt-4">
        {tab === "preview" ? (
          <div
            className={cn("pl-preview relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-bg", padded ? "p-6 sm:p-10" : "p-3 sm:p-4")}
            style={{ minHeight }}
          >
            <ErrorBoundary key={key}><Demo /></ErrorBoundary>
          </div>
        ) : (
          <Code code={code} maxHeight={520} />
        )}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { err?: Error }> {
  state: { err?: Error } = {};
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() { return this.state.err ? <p className="text-sm text-danger">Demo error: {this.state.err.message}</p> : this.props.children; }
}

/* Plain-language fallbacks for undocumented props. */
export const propHints: Record<string, string> = {
  value: "Controlled value.", onValueChange: "Called with the new value.", onSubmit: "Called with the current text when the user sends.",
  onStop: "Stops generation. Shown while streaming.", status: "Request lifecycle state; drives the submit button.",
  className: "Extra classes for the root element.", children: "Content.", open: "Controls visibility.", onClose: "Called on Esc, backdrop click or close button.",
  onOpenChange: "Called when the component wants to open or close.", title: "Heading text.", description: "Supporting text.",
  defaultOpen: "Initial expanded state (uncontrolled).", placeholder: "Placeholder text.", disabled: "Disables interaction.",
  label: "Visible or accessible label.", onRetry: "Shows a retry button and handles the click.", onRemove: "Shows a remove button and handles the click.",
  isStreaming: "True while the model is producing this content.", state: "Current state of the component.", items: "Items to render.",
  models: "Models to choose from.", onLockedSelect: "Called when a locked model is chosen — open your paywall here.",
  side: "Which side the menu opens on.", align: "Horizontal alignment of the menu.", sources: "Sources to list.", steps: "Steps to show.",
  onApprove: "Called when the user approves.", onDeny: "Called when the user denies.", icon: "Leading icon.", onAction: "Primary action handler.",
  actionLabel: "Overrides the default action label.", onDismiss: "Shows a dismiss button.", used: "Amount used.", limit: "Total allowed.", max: "Maximum capacity.",
  plans: "Plans to show.", onSelect: "Called with the chosen id.", onUpgrade: "Shows an upgrade link.", resetText: "When the limit resets, e.g. \"Resets in 6h\".",
  chats: "Conversation list.", activeId: "Currently open item.", onNew: "Starts a new chat.", onMore: "Shows a row menu button.", header: "Slot above the content.", footer: "Slot below the content.",
  commands: "Commands to search.", onCommand: "Called with the command id.", onGenerate: "Starts generation.", onCancel: "Cancels the current operation.",
  onStart: "Starts recording.", onDone: "Finishes and submits.", enabled: "Whether the feature is on.", onEnabledChange: "Called when the switch changes.",
  onDelete: "Deletes an item by id.", onEdit: "Saves an edited item.", onClearAll: "Shows a clear-all button.", code: "Source code to display.", language: "Language label and file extension.",
  filename: "Shown in the header instead of the language.", url: "Address to show / load.", logs: "Console entries to show in the drawer.", data: "Attachment data.",
  alt: "Image description — also shown while generating.", src: "Image source.", progress: "Progress from 0 to 100.", branches: "Alternative versions; one is shown at a time.",
  duration: "Time taken, shown when finished.", name: "Identifier or tool name.", input: "Tool parameters (rendered as JSON).", output: "Tool result (rendered as JSON).",
  errorText: "Error message to show.", level: "Confidence level.", text: "Text content.", suggestion: "The prompt this suggestion inserts.", onPick: "Called with the suggestion text.",
  original: "The selected text.", onPrompt: "Called with a custom instruction.", onAccept: "Applies the suggestion.", from: "Who sent the message.", avatar: "Avatar node.", meta: "Small line above the content (name, time).",
};
