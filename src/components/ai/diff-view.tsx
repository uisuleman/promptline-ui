import * as React from "react";
import { Check, X, FileCode2, Undo2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * DiffView
 * Review an agent's code changes hunk by hunk: Accept or Reject each, or all at once.
 * Decided hunks collapse to a one-line summary with Undo, so the remaining work is obvious.
 */
export type DiffLine = { type: "context" | "add" | "del"; text: string; oldNo?: number; newNo?: number };
export interface Hunk { id: string; header?: string; lines: DiffLine[] }
export type HunkDecision = "accepted" | "rejected";

export interface DiffViewProps {
  filename: string;
  hunks: Hunk[];
  decisions?: Record<string, HunkDecision>;
  onDecide?: (hunkId: string, decision: HunkDecision | null) => void;
  onDecideAll?: (decision: HunkDecision) => void;
  className?: string;
}

/** Build hunks from before/after text (simple line diff for demos and small files). */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n"), b = after.split("\n");
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffLine[] = [];
  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && a[i] === b[j]) { out.push({ type: "context", text: a[i], oldNo: i + 1, newNo: j + 1 }); i++; j++; }
    else if (i < m && (j >= n || dp[i + 1][j] >= dp[i][j + 1])) { out.push({ type: "del", text: a[i], oldNo: i + 1 }); i++; }
    else { out.push({ type: "add", text: b[j], newNo: j + 1 }); j++; }
  }
  return out;
}

export function DiffView({ filename, hunks, decisions = {}, onDecide, onDecideAll, className }: DiffViewProps) {
  const adds = hunks.reduce((s, h) => s + h.lines.filter((l) => l.type === "add").length, 0);
  const dels = hunks.reduce((s, h) => s + h.lines.filter((l) => l.type === "del").length, 0);
  const pending = hunks.filter((h) => !decisions[h.id]).length;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm", className)}>
      <div className="flex min-h-11 flex-wrap items-center gap-3 border-b border-border bg-surface px-3 py-1.5">
        <FileCode2 className="size-4 text-fg-muted" />
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-fg">{filename}</span>
        <span className="font-mono text-xs"><span className="text-success">+{adds}</span> <span className="text-danger">−{dels}</span></span>
        {onDecideAll && pending > 0 && (
          <span className="flex gap-1">
            <Button size="xs" variant="ghost" onClick={() => onDecideAll("rejected")}>Reject all</Button>
            <Button size="xs" onClick={() => onDecideAll("accepted")}>Accept all</Button>
          </span>
        )}
        {pending === 0 && <span className="text-xs text-fg-subtle">All changes reviewed</span>}
      </div>
      {hunks.map((h) => {
        const d = decisions[h.id];
        if (d)
          return (
            <div key={h.id} className="flex h-10 items-center gap-2 border-b border-border px-3 text-xs text-fg-muted last:border-0">
              {d === "accepted" ? <Check className="size-3.5 text-success" /> : <X className="size-3.5 text-danger" />}
              <span className="font-mono">{h.header ?? "Change"}</span><span>· {d}</span>
              {onDecide && <button type="button" onClick={() => onDecide(h.id, null)} className="ml-auto inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 hover:bg-surface-2 hover:text-fg"><Undo2 className="size-3" />Undo</button>}
            </div>
          );
        return (
          <div key={h.id} className="group/h border-b border-border last:border-0">
            <div className="flex h-9 items-center gap-2 bg-info/[0.05] px-3 font-mono text-xs text-fg-muted">
              <span className="flex-1 truncate">{h.header ?? "@@"}</span>
              {onDecide && (
                <span className="flex gap-1">
                  <button type="button" onClick={() => onDecide(h.id, "rejected")} aria-label="Reject change" className="inline-flex h-6 items-center gap-1 rounded-xs border border-border bg-bg px-2 font-sans text-fg-muted hover:text-danger"><X className="size-3" />Reject</button>
                  <button type="button" onClick={() => onDecide(h.id, "accepted")} aria-label="Accept change" className="inline-flex h-6 items-center gap-1 rounded-xs bg-accent px-2 font-sans text-accent-fg hover:bg-accent/85"><Check className="size-3" />Accept</button>
                </span>
              )}
            </div>
            <table className="w-full border-collapse font-mono text-xs leading-5">
              <tbody>
                {h.lines.map((l, i) => (
                  <tr key={i} className={cn(l.type === "add" && "bg-success/[0.08]", l.type === "del" && "bg-danger/[0.08]")}>
                    <td className="w-10 select-none px-2 text-right text-fg-subtle">{l.oldNo ?? ""}</td>
                    <td className="w-10 select-none px-2 text-right text-fg-subtle">{l.newNo ?? ""}</td>
                    <td className={cn("w-5 select-none text-center", l.type === "add" ? "text-success" : l.type === "del" ? "text-danger" : "text-fg-subtle")}>{l.type === "add" ? "+" : l.type === "del" ? "−" : ""}</td>
                    <td className={cn("whitespace-pre-wrap break-all pr-4", l.type === "del" ? "text-fg-muted" : "text-fg")}>{l.text || " "}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
