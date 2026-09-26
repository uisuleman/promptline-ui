import * as React from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Monitor, RotateCw, Smartphone, Tablet, Terminal } from "lucide-react";
import { cn } from "../../lib/cn";
import { Tooltip } from "../ui/tooltip";

/**
 * WebPreview
 * Browser frame for AI-generated sites and apps (v0 / Lovable style).
 * URL bar, reload, device widths, open in new tab, and an optional console drawer for logs.
 */
export interface ConsoleLog { level: "log" | "warn" | "error"; message: string; time?: string }

export interface WebPreviewProps {
  url: string;
  /** Render an iframe to `url` (default) or pass your own content */
  children?: React.ReactNode;
  logs?: ConsoleLog[];
  onUrlChange?: (url: string) => void;
  height?: number;
  className?: string;
}

const widths = { desktop: "100%", tablet: "768px", mobile: "390px" } as const;

export function WebPreview({ url, children, logs, onUrlChange, height = 480, className }: WebPreviewProps) {
  const [draft, setDraft] = React.useState(url);
  const [device, setDevice] = React.useState<keyof typeof widths>("desktop");
  const [key, setKey] = React.useState(0);
  const [consoleOpen, setConsoleOpen] = React.useState(false);
  React.useEffect(() => setDraft(url), [url]);
  const btn = "grid size-7 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-40";
  const errors = logs?.filter((l) => l.level === "error").length ?? 0;

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-sm", className)}>
      <div className="flex h-11 items-center gap-1 border-b border-border px-2">
        <button type="button" className={btn} aria-label="Back" onClick={() => history.back()}><ArrowLeft className="size-4" /></button>
        <button type="button" className={btn} aria-label="Forward" onClick={() => history.forward()}><ArrowRight className="size-4" /></button>
        <button type="button" className={btn} aria-label="Reload" onClick={() => setKey((k) => k + 1)}><RotateCw className="size-3.5" /></button>
        <form className="mx-1 min-w-0 flex-1" onSubmit={(e) => { e.preventDefault(); onUrlChange?.(draft); }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="URL" spellCheck={false} className="h-7 w-full rounded-sm bg-surface-2 px-3 font-mono text-xs text-fg-muted focus:bg-bg focus:text-fg focus:outline-none focus:ring-1 focus:ring-border-strong" />
        </form>
        <div className="hidden items-center sm:flex" role="group" aria-label="Device width">
          {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
            <Tooltip key={d} label={d[0].toUpperCase() + d.slice(1)} side="bottom">
              <button type="button" aria-pressed={device === d} aria-label={d} onClick={() => setDevice(d)} className={cn(btn, device === d && "bg-surface-2 text-fg")}><Icon className="size-3.5" /></button>
            </Tooltip>
          ))}
        </div>
        <Tooltip label="Open in new tab" side="bottom"><a href={url} target="_blank" rel="noreferrer" className={btn} aria-label="Open in new tab"><ExternalLink className="size-3.5" /></a></Tooltip>
      </div>
      <div className="relative flex justify-center bg-surface" style={{ height }}>
        <div className="h-full transition-[width] duration-300" style={{ width: widths[device], maxWidth: "100%" }}>
          {children ? <div key={key} className="h-full overflow-auto bg-bg">{children}</div> : <iframe key={key} src={url} title="Preview" className="size-full border-0 bg-white" sandbox="allow-scripts allow-same-origin allow-forms" />}
        </div>
      </div>
      {logs && (
        <div className="border-t border-border">
          <button type="button" aria-expanded={consoleOpen} onClick={() => setConsoleOpen((o) => !o)} className="flex h-9 w-full items-center gap-2 px-3 text-xs font-medium text-fg-muted hover:text-fg">
            <Terminal className="size-3.5" />Console
            {errors > 0 && <span className="rounded-full bg-danger/10 px-1.5 text-2xs text-danger">{errors} error{errors > 1 && "s"}</span>}
          </button>
          {consoleOpen && (
            <ul className="max-h-40 overflow-auto border-t border-border font-mono text-xs">
              {logs.map((l, i) => (
                <li key={i} className={cn("flex gap-3 border-b border-border px-3 py-1.5 last:border-0", l.level === "error" && "bg-danger/5 text-danger", l.level === "warn" && "bg-warning/5 text-warning", l.level === "log" && "text-fg-muted")}>
                  {l.time && <span className="shrink-0 text-fg-subtle">{l.time}</span>}
                  <span className="min-w-0 break-all">{l.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
