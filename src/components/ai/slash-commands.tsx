"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * SlashCommands
 * Type "/" at the start of the prompt to open a filterable command list above the input.
 * Wraps any text input through a render prop: pass the provided `onKeyDown` to it.
 * - ↑ ↓ to move, Enter / Tab to run, Esc to dismiss
 * - Ranked matching: label starts-with first, then contains, then description
 * - Grouped, with icons, descriptions and optional shortcut hints
 */
export interface SlashCommand {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  /** Extra words that should match, e.g. ["img", "picture"] */
  keywords?: string[];
}

export interface SlashCommandsProps {
  value: string;
  onValueChange: (v: string) => void;
  commands: SlashCommand[];
  /** Called with the chosen command. The "/query" text is cleared first. */
  onRun: (command: SlashCommand) => void;
  children: (input: { onKeyDown: (e: React.KeyboardEvent) => void; open: boolean }) => React.ReactNode;
  emptyText?: string;
  className?: string;
}

export function rankCommands(commands: SlashCommand[], query: string) {
  const q = query.toLowerCase();
  if (!q) return commands;
  const score = (c: SlashCommand) => {
    const l = c.label.toLowerCase();
    if (l.startsWith(q) || c.id.startsWith(q)) return 0;
    if (l.includes(q) || c.keywords?.some((k) => k.startsWith(q))) return 1;
    if (c.description?.toLowerCase().includes(q)) return 2;
    return -1;
  };
  return commands.map((c) => [c, score(c)] as const).filter(([, s]) => s >= 0).sort((a, b) => a[1] - b[1]).map(([c]) => c);
}

export function SlashCommands({ value, onValueChange, commands, onRun, children, emptyText = "No commands found", className }: SlashCommandsProps) {
  const match = /^\/(\S*)$/.exec(value);
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const open = !!match && dismissed !== value;
  const query = match?.[1] ?? "";
  const results = React.useMemo(() => (open ? rankCommands(commands, query) : []), [open, commands, query]);
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => setActive(0), [query]);
  React.useEffect(() => { if (!match) setDismissed(null); }, [match]);
  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (c: SlashCommand) => { onValueChange(""); onRun(c); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (results.length ? (a + 1) % results.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0)); }
    else if ((e.key === "Enter" || e.key === "Tab") && !(e.nativeEvent as KeyboardEvent).isComposing) {
      if (results[active]) { e.preventDefault(); run(results[active]); }
      else if (e.key === "Enter") e.preventDefault();
    } else if (e.key === "Escape") { e.preventDefault(); setDismissed(value); }
  };

  // Group while keeping ranked order inside each group
  const groups: [string, { c: SlashCommand; i: number }[]][] = [];
  results.forEach((c, i) => {
    const g = c.group ?? "";
    const found = groups.find(([name]) => name === g);
    found ? found[1].push({ c, i }) : groups.push([g, [{ c, i }]]);
  });

  return (
    <div className={cn("relative", className)}>
      {open && (
        <div
          ref={listRef}
          id={id}
          role="listbox"
          aria-label="Commands"
          className="absolute inset-x-0 bottom-full z-30 mb-2 max-h-72 overflow-y-auto rounded-lg border border-border bg-bg p-1 shadow-lg"
          style={{ animation: "pl-in .12s ease-out" }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-fg-subtle">{emptyText}</p>}
          {groups.map(([g, items]) => (
            <div key={g || "_"} role="group" aria-label={g || undefined}>
              {g && <p className="px-2 pb-1 pt-2 text-xs font-medium text-fg-subtle">{g}</p>}
              {items.map(({ c, i }) => (
                <div
                  key={c.id}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-md px-2 py-2", i === active && "bg-surface-2")}
                >
                  {c.icon && <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-bg text-fg-muted [&_svg]:size-4">{c.icon}</span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg"><Highlight text={c.label} query={query} /></span>
                    {c.description && <span className="block truncate text-xs text-fg-muted">{c.description}</span>}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-fg-subtle">/{c.id}</span>
                </div>
              ))}
            </div>
          ))}
          <p className="mt-1 hidden border-t border-border px-2 pb-1 pt-2 text-2xs text-fg-subtle sm:block">↑↓ to navigate · Enter to run · Esc to close</p>
        </div>
      )}
      {children({ onKeyDown, open })}
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark className="rounded-xs bg-transparent text-fg underline decoration-fg-subtle underline-offset-2">{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
}
