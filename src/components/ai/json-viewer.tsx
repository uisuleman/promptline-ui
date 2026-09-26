import * as React from "react";
import { Check, ChevronRight, Copy, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { useCopy } from "../../lib/hooks";

/**
 * JsonViewer
 * Structured output and tool results as a collapsible tree.
 * - Type-coloured values using the syntax tokens
 * - Collapsed nodes show a summary ({4} / [12]) so you can scan without expanding
 * - Copy the whole document, or any value by its row
 * - Expand / collapse all
 */
export interface JsonViewerProps {
  data: unknown;
  /** Levels open on first render (default 2) */
  defaultExpandDepth?: number;
  /** Header label, e.g. the tool name */
  label?: React.ReactNode;
  maxHeight?: number;
  className?: string;
}

type Path = string;

export function JsonViewer({ data, defaultExpandDepth = 2, label = "JSON", maxHeight = 420, className }: JsonViewerProps) {
  const { copied, copy } = useCopy();
  const [mode, setMode] = React.useState<{ all: boolean | null; n: number }>({ all: null, n: 0 });
  const text = React.useMemo(() => JSON.stringify(data, null, 2), [data]);
  return (
    <div className={cn("w-full overflow-hidden rounded-lg border border-border bg-bg", className)}>
      <div className="flex h-10 items-center gap-2 border-b border-border bg-surface px-3">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-fg-muted">{label}</span>
        <button type="button" onClick={() => setMode((m) => ({ all: !(m.all ?? false), n: m.n + 1 }))} aria-label={mode.all ? "Collapse all" : "Expand all"}
          className="grid size-7 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg [&_svg]:size-3.5">
          {mode.all ? <ChevronsDownUp /> : <ChevronsUpDown />}
        </button>
        <button type="button" onClick={() => copy(text)} className="inline-flex h-7 items-center gap-1.5 rounded-sm px-2 text-xs font-medium text-fg-muted hover:bg-surface-2 hover:text-fg [&_svg]:size-3.5">
          {copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div role="tree" aria-label="JSON" className="overflow-auto py-2 font-mono text-[13px] leading-6" style={{ maxHeight }}>
        <Node k={null} v={data} depth={0} path="$" defaultDepth={defaultExpandDepth} mode={mode} last />
      </div>
    </div>
  );
}

const isObj = (v: unknown): v is Record<string, unknown> | unknown[] => typeof v === "object" && v !== null;

function Value({ v }: { v: unknown }) {
  if (v === null) return <span className="text-[rgb(var(--syn-keyword))]">null</span>;
  if (typeof v === "string") return <span className="text-[rgb(var(--syn-string))] [overflow-wrap:anywhere]">"{v}"</span>;
  if (typeof v === "number") return <span className="text-[rgb(var(--syn-number))]">{v}</span>;
  if (typeof v === "boolean") return <span className="text-[rgb(var(--syn-keyword))]">{String(v)}</span>;
  return <span className="text-fg-muted">{String(v)}</span>;
}

function Node({ k, v, depth, path, defaultDepth, mode, last }: { k: string | number | null; v: unknown; depth: number; path: Path; defaultDepth: number; mode: { all: boolean | null; n: number }; last: boolean }) {
  const [open, setOpen] = React.useState(depth < defaultDepth);
  const { copied, copy } = useCopy(1200);
  React.useEffect(() => { if (mode.all !== null) setOpen(mode.all); }, [mode.n]); // eslint-disable-line react-hooks/exhaustive-deps
  const pad = { paddingLeft: 12 + depth * 16 };
  const keyEl = k === null ? null : <><span className={typeof k === "number" ? "text-fg-subtle" : "text-[rgb(var(--syn-fn))]"}>{typeof k === "number" ? k : `"${k}"`}</span><span className="text-fg-subtle">: </span></>;
  const comma = last ? null : <span className="text-fg-subtle">,</span>;
  const copyBtn = (
    <button type="button" tabIndex={-1} onClick={(e) => { e.stopPropagation(); copy(typeof v === "string" ? v : JSON.stringify(v, null, 2)); }} aria-label="Copy value"
      className="ml-2 inline-grid size-5 place-items-center rounded-xs align-middle text-fg-subtle opacity-0 hover:bg-surface-2 hover:text-fg group-hover/row:opacity-100 [&_svg]:size-3">
      {copied ? <Check /> : <Copy />}
    </button>
  );

  if (!isObj(v)) {
    return <div role="treeitem" className="group/row whitespace-pre-wrap pr-3 hover:bg-surface" style={pad}>{keyEl}<Value v={v} />{comma}{copyBtn}</div>;
  }
  const arr = Array.isArray(v);
  const entries = arr ? (v as unknown[]).map((x, i) => [i, x] as const) : Object.entries(v);
  const [o, c] = arr ? ["[", "]"] : ["{", "}"];
  return (
    <div role="treeitem" aria-expanded={open}>
      <div className="group/row flex cursor-pointer items-center pr-3 hover:bg-surface" style={{ paddingLeft: pad.paddingLeft - 14 }} onClick={() => setOpen((x) => !x)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((x) => !x); } if (e.key === "ArrowRight") setOpen(true); if (e.key === "ArrowLeft") setOpen(false); }} tabIndex={0}>
        <ChevronRight className={cn("mr-0.5 size-3 shrink-0 text-fg-subtle transition-transform", open && "rotate-90")} />
        <span className="min-w-0">
          {keyEl}<span className="text-fg-muted">{o}</span>
          {!open && <><span className="mx-1 rounded-xs bg-surface-2 px-1 text-xs text-fg-subtle">{entries.length} {arr ? (entries.length === 1 ? "item" : "items") : (entries.length === 1 ? "key" : "keys")}</span><span className="text-fg-muted">{c}</span>{comma}</>}
        </span>
        {copyBtn}
      </div>
      {open && (
        <div role="group">
          {entries.map(([ck, cv], i) => <Node key={String(ck)} k={ck} v={cv} depth={depth + 1} path={`${path}.${ck}`} defaultDepth={defaultDepth} mode={mode} last={i === entries.length - 1} />)}
          <div style={pad} className="text-fg-muted">{c}{comma}</div>
        </div>
      )}
    </div>
  );
}
