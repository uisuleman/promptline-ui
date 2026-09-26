import * as React from "react";
import { createRoot } from "react-dom/client";
import { Menu, Moon, Search, Sun, X, BookOpen, Component } from "lucide-react";
import { registry, sections } from "./registry";
import { docPages, docSections, useRoute, allPages, hrefFor, navigate } from "./lib";
import { ComponentPage, PageLink } from "./pages/component-page";
import { Home, SiteFooter } from "./pages/home";
import { Privacy, Terms } from "./pages/legal";
import { Introduction, Why, Changelog, ComponentsIndex, Installation, Usage, AiTools, Troubleshooting, Colors, Typography, Spacing, ThemeBuilder, Contributing, NewComponents, Philosophy, applyBrand } from "./pages/doc-pages";
import { Toaster, CommandBar, Kbd, Badge, Button, cn } from "../src";
import { Search as SearchIcon } from "lucide-react";
import { GITHUB_URL } from "./site";
const GithubIcon = () => <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>;

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 text-base font-semibold text-fg">
      <span className="grid size-6 place-items-center rounded-sm bg-fg text-bg">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden><path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13 6.4 8.6 2 7l4.4-1.6z" /></svg>
      </span>
      Promptline UI
    </a>
  );
}

type Area = "docs" | "components";

function Sidebar({ area, current, onNavigate }: { area: Area; current: string; onNavigate?: () => void }) {
  const [q, setQ] = React.useState("");
  const match = (t: string) => t.toLowerCase().includes(q.trim().toLowerCase());
  const link = (href: string, label: React.ReactNode, isNew?: boolean) => (
    <li key={href}>
      <a href={href} onClick={onNavigate} aria-current={current === href ? "page" : undefined}
        className={cn("flex h-8 items-center justify-between rounded-sm px-2 text-sm transition-colors", current === href ? "bg-surface-2 font-medium text-fg" : "text-fg-muted hover:bg-surface-2/60 hover:text-fg")}>
        {label}{isNew && <span className="size-1.5 rounded-full bg-info" aria-label="New" />}
      </a>
    </li>
  );
  const heading = (t: React.ReactNode) => <p className="mb-1 flex items-center justify-between px-2 text-xs font-medium text-fg-subtle">{t}</p>;

  if (area === "docs")
    return (
      <nav aria-label="Docs" className="space-y-6 text-sm">
        {docSections.map((sec) => (
          <div key={sec}>
            {heading(sec)}
            <ul>{docPages.filter((p) => p.section === sec).map((p) => link(hrefFor(p), p.title))}</ul>
          </div>
        ))}
      </nav>
    );

  return (
    <nav aria-label="Components" className="space-y-6 text-sm">
      <label className="flex h-8 items-center gap-2 rounded-md border border-border bg-bg px-2 text-fg-subtle focus-within:border-border-strong">
        <SearchIcon className="size-3.5 shrink-0" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter components…" aria-label="Filter components" className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none" />
      </label>
      {!q && <ul>{link("/components", "Overview")}</ul>}
      {sections.map((sec) => {
        if (!registry.some((r) => r.section === sec.id && match(r.name))) return null;
        return (
          <div key={sec.id} className="space-y-4">
            <p className="border-t border-border px-2 pt-4 text-xs font-semibold uppercase tracking-wide text-fg">{sec.title}</p>
            {sec.groups.map((g) => {
              const items = registry.filter((r) => r.section === sec.id && r.group === g && match(r.name));
              if (!items.length) return null;
              return (
                <div key={g}>
                  {heading(<>{g}<span className="tabular-nums">{items.length}</span></>)}
                  <ul>{items.map((r) => link(hrefFor(r), r.name, r.isNew))}</ul>
                </div>
              );
            })}
          </div>
        );
      })}
      {q && !registry.some((r) => match(r.name)) && <p className="px-2 text-sm text-fg-subtle">No components match "{q}"</p>}
    </nav>
  );
}

function TopNav({ area, onNavigate, className }: { area: Area | "home"; onNavigate?: () => void; className?: string }) {
  const item = (href: string, label: React.ReactNode, on: boolean) => (
    <a href={href} onClick={onNavigate} aria-current={on ? "page" : undefined}
      className={cn("inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors", on ? "text-fg" : "text-fg-muted hover:text-fg")}>
      {label}
    </a>
  );
  return (
    <nav aria-label="Main" className={cn("flex items-center gap-1", className)}>
      {item("/components", <>Components<span className="rounded-full bg-surface-2 px-1.5 text-xs tabular-nums text-fg-muted">{registry.length}</span></>, area === "components")}
      {item("/docs/introduction", "Docs", area === "docs")}
    </nav>
  );
}

function Toc({ deps }: { deps: unknown }) {
  const [items, setItems] = React.useState<{ id: string; text: string; sub: boolean }[]>([]);
  const [active, setActive] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-toc]"));
      setItems(els.map((e) => ({ id: e.id, text: e.textContent ?? "", sub: e.dataset.toc === "sub" })));
      const io = new IntersectionObserver((en) => { const v = en.filter((x) => x.isIntersecting)[0]; if (v) setActive(v.target.id); }, { rootMargin: "-80px 0px -70% 0px" });
      els.forEach((e) => io.observe(e));
      cleanup = () => io.disconnect();
    }, 50);
    let cleanup = () => {};
    return () => { clearTimeout(t); cleanup(); };
  }, [deps]);
  if (!items.length) return null;
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-2 text-xs font-medium text-fg-subtle">On this page</p>
      <ul className="space-y-1 border-l border-border">
        {items.map((i) => (
          <li key={i.id}>
            <button type="button" onClick={() => document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth" })}
              className={cn("-ml-px block border-l py-1 text-left transition-colors", i.sub ? "pl-6" : "pl-3", active === i.id ? "border-fg text-fg" : "border-transparent text-fg-muted hover:text-fg")}>
              {i.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function App() {
  const route = useRoute();
  const [dark, setDark] = React.useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  const [menu, setMenu] = React.useState(false);
  const [search, setSearch] = React.useState(false);
  const current = route.kind === "component" ? hrefFor(route.entry) : route.kind === "components" ? "/components" : route.kind === "doc" ? `/docs/${route.id}` : "/";
  const isHome = route.kind === "home" || route.kind === "legal" || route.kind === "notfound";
  const area: Area = route.kind === "doc" || isHome ? "docs" : "components";

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    applyBrand(document.documentElement.dataset.brand ?? "Neutral");
  }, [dark]);
  React.useEffect(() => {
    document.title = route.kind === "notfound" ? "Page not found · Promptline UI" : route.kind === "home" ? "Promptline UI — The UI layer for AI products" : route.kind === "legal" ? (route.id === "privacy" ? "Privacy Policy" : "Terms of Service") + " · Promptline UI" : (route.kind === "component" ? route.entry.name : route.kind === "components" ? "Components" : docPages.find((p) => p.id === route.id)?.title) + " · Promptline UI";
    setMenu(false);
  }, [route]);

  let page: React.ReactNode;
  if (route.kind === "component") page = <ComponentPage key={route.entry.slug} e={route.entry} />;
  else if (route.kind === "components") page = <ComponentsIndex />;
  else if (route.kind === "home") page = <Home />;
  else if (route.kind === "notfound") page = (
    <section className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <p className="font-mono text-sm text-fg-subtle">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">Page not found</h1>
      <p className="mt-3 text-fg-muted">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex gap-3"><Button onClick={() => navigate("/")}>Go home</Button><Button variant="outline" onClick={() => navigate("/components")}>Browse components</Button></div>
    </section>
  );
  else if (route.kind === "legal") page = route.id === "privacy" ? <Privacy /> : <Terms />;
  else page = ({ introduction: <Introduction />, why: <Why />, changelog: <Changelog />, installation: <Installation />, usage: <Usage />, "ai-tools": <AiTools />, troubleshooting: <Troubleshooting />, colors: <Colors />, typography: <Typography />, spacing: <Spacing />, theme: <ThemeBuilder />, contributing: <Contributing />, "new-components": <NewComponents />, philosophy: <Philosophy /> } as Record<string, React.ReactNode>)[route.id];

  const flat = docPages.map((p) => ({ href: hrefFor(p), name: p.title }));
  const idx = flat.findIndex((f) => f.href === current);
  const prev = flat[idx - 1], next = flat[idx + 1];

  return (
    <div className="min-h-screen bg-bg font-sans text-fg antialiased">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-4 px-4 lg:px-6">
          <Button variant="ghost" size="icon-sm" className={isHome ? "md:hidden" : "lg:hidden"} onClick={() => setMenu(true)} aria-label="Open menu"><Menu /></Button>
          <Logo />
          <TopNav area={isHome ? "home" : area} className="ml-4 hidden md:flex" />
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setSearch(true)} className="flex h-8 items-center gap-2 rounded-md border border-border bg-surface pl-3 pr-1.5 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg-muted sm:w-64">
              <Search className="size-3.5" /><span className="hidden flex-1 text-left sm:inline">Search…</span>
              <span className="hidden gap-0.5 sm:flex"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
            </button>
            {GITHUB_URL && <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="grid size-8 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg [&_svg]:size-4"><GithubIcon /></a>}
            <Button variant="ghost" size="icon-sm" onClick={() => setDark((d) => !d)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun /> : <Moon />}</Button>
          </div>
        </div>
      </header>

      {isHome ? (
        <main id="pl-main">{page}<SiteFooter /></main>
      ) : (
      <div className="mx-auto flex max-w-screen-2xl">
          <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-64 shrink-0 overflow-y-auto border-r border-border px-4 py-6 lg:block">
            <Sidebar key={area} area={area} current={current} />
          </aside>
  
          <main id="pl-main" className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-[1080px] gap-12">
              <div className="min-w-0 flex-1">
                {page}
                {route.kind === "doc" && (
                  <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-8" aria-label="Pagination">
                    {prev ? <PageLink href={prev.href} label="Previous" name={prev.name} dir="prev" /> : <span />}
                    {next ? <PageLink href={next.href} label="Next" name={next.name} dir="next" /> : <span />}
                  </nav>
                )}
                <footer className="mt-16 border-t border-border pt-6 text-sm text-fg-subtle">
                  Promptline UI — free and open source (MIT). Made by <a href="https://x.com/uisuleman" target="_blank" rel="noreferrer" className="text-fg-muted hover:text-fg">@uisuleman</a> · <a href="/privacy" className="hover:text-fg">Privacy</a> · <a href="/terms" className="hover:text-fg">Terms</a>
                </footer>
              </div>
              <aside className="sticky top-24 hidden h-fit w-48 shrink-0 xl:block"><Toc deps={current} /></aside>
            </div>
          </main>
        </div>
      )}

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenu(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border bg-bg p-4 shadow-lg" style={{ animation: "pl-in .2s ease-out" }} role="dialog" aria-label="Navigation">
            <div className="mb-6 flex items-center justify-between"><Logo /><Button variant="ghost" size="icon-sm" onClick={() => setMenu(false)} aria-label="Close menu"><X /></Button></div>
            <TopNav area={isHome ? "home" : area} onNavigate={() => setMenu(false)} className="-mx-3 mb-6 flex-col items-start" />
            {!isHome && <Sidebar key={area} area={area} current={current} onNavigate={() => setMenu(false)} />}
          </div>
        </div>
      )}

      <CommandBar
        open={search}
        onOpenChange={setSearch}
        placeholder="Search components and docs…"
        commands={allPages.map((p) => ({ id: p.href, label: p.title, group: p.section, icon: p.href.includes("/docs/") ? <BookOpen /> : <Component /> }))}
        onCommand={(href) => navigate(href)}
      />
    </div>
  );
}

export function Root() { return <Toaster><App /></Toaster>; }

if (typeof document !== "undefined" && document.getElementById("root")) {
  const root = document.getElementById("root")!;
  createRoot(root).render(<Root />);
}
