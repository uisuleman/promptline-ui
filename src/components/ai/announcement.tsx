import * as React from "react";
import { ArrowRight, X, Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Announcement
 * Tell users about something new without a modal:
 * - <AnnouncementPill/> above an empty state or in a header ("New · Nova is here →")
 * - <AnnouncementBar/> full-width strip at the top of the app, dismissible and remembered by `id`
 */
export function AnnouncementPill({ tag = "New", children, href, onClick, className }: { tag?: React.ReactNode; children: React.ReactNode; href?: string; onClick?: () => void; className?: string }) {
  const C: any = href ? "a" : "button";
  return (
    <C
      href={href}
      type={href ? undefined : "button"}
      onClick={onClick}
      className={cn("group inline-flex h-8 items-center gap-2 rounded-full border border-border bg-bg py-1 pl-1 pr-3 text-sm text-fg-muted shadow-xs transition-colors hover:border-border-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20", className)}
    >
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-accent px-2 text-xs font-medium text-accent-fg [&_svg]:size-3">{tag}</span>
      {children}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </C>
  );
}

export function AnnouncementBar({ id, children, action, onDismiss, tone = "accent", className }: { id?: string; children: React.ReactNode; action?: { label: string; href?: string; onClick?: () => void }; onDismiss?: () => void; tone?: "accent" | "subtle"; className?: string }) {
  const key = id ? `pl-announcement-${id}` : null;
  const [hidden, setHidden] = React.useState(() => { try { return key ? localStorage.getItem(key) === "1" : false; } catch { return false; } });
  if (hidden) return null;
  const dismiss = () => { setHidden(true); try { if (key) localStorage.setItem(key, "1"); } catch { /* storage blocked */ } onDismiss?.(); };
  return (
    <div role="region" aria-label="Announcement" className={cn("relative flex min-h-10 items-center justify-center gap-3 px-12 py-2 text-center text-sm", tone === "accent" ? "bg-accent text-accent-fg" : "border-b border-border bg-surface text-fg", className)}>
      <Sparkles className="hidden size-4 shrink-0 opacity-80 sm:block" />
      <span>{children}</span>
      {action && (
        <a href={action.href} onClick={action.onClick} className="shrink-0 cursor-pointer font-medium underline underline-offset-4 hover:no-underline">{action.label}</a>
      )}
      <button type="button" onClick={dismiss} aria-label="Dismiss announcement" className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-sm opacity-70 hover:bg-black/10 hover:opacity-100 dark:hover:bg-white/10"><X className="size-4" /></button>
    </div>
  );
}
