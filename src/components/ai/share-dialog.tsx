import * as React from "react";
import { Check, Copy, Globe, Link2, Lock, Info } from "lucide-react";
import { cn } from "../../lib/cn";
import { useCopy } from "../../lib/hooks";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

/**
 * ShareDialog
 * Share a conversation or result with clear access levels and an honest note about
 * what the recipient will — and won't — see. The link only appears once sharing is on.
 */
export type ShareAccess = "private" | "link" | "public";

export interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  access: ShareAccess;
  onAccessChange: (a: ShareAccess) => void;
  url: string;
  title?: string;
  /** What's included / excluded, e.g. "Messages you send after sharing stay private." */
  note?: React.ReactNode;
  /** Hide the "Public" option (e.g. for team workspaces) */
  allowPublic?: boolean;
  onCopy?: () => void;
}

const options: { id: ShareAccess; icon: React.ReactNode; label: string; hint: string }[] = [
  { id: "private", icon: <Lock />, label: "Private", hint: "Only you can see this" },
  { id: "link", icon: <Link2 />, label: "Anyone with the link", hint: "Can view, can't edit or continue" },
  { id: "public", icon: <Globe />, label: "Public", hint: "Listed and discoverable by search engines" },
];

export function ShareDialog({ open, onClose, access, onAccessChange, url, title = "Share chat", note, allowPublic = true, onCopy }: ShareDialogProps) {
  const { copied, copy } = useCopy();
  const id = React.useId();
  const list = allowPublic ? options : options.filter((o) => o.id !== "public");
  const shared = access !== "private";
  const move = (dir: 1 | -1) => { const i = list.findIndex((o) => o.id === access); onAccessChange(list[(i + dir + list.length) % list.length].id); };

  return (
    <Dialog open={open} onClose={onClose} labelledBy={id} className="max-w-md">
      <DialogHeader>
        <DialogTitle id={id}>{title}</DialogTitle>
        <DialogDescription>Choose who can view this conversation.</DialogDescription>
      </DialogHeader>
      <DialogBody className="space-y-4">
        <div role="radiogroup" aria-label="Access" className="overflow-hidden rounded-lg border border-border"
          onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}>
          {list.map((o) => {
            const on = access === o.id;
            return (
              <button key={o.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} onClick={() => onAccessChange(o.id)}
                className={cn("flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-colors last:border-b-0", on ? "bg-surface" : "hover:bg-surface/60")}>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-md border [&_svg]:size-4", on ? "border-fg bg-fg text-bg" : "border-border text-fg-muted")}>{o.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-fg">{o.label}</span>
                  <span className="block text-xs text-fg-muted">{o.hint}</span>
                </span>
                <span className={cn("grid size-4 shrink-0 place-items-center rounded-full border", on ? "border-fg" : "border-border-strong")}>{on && <span className="size-2 rounded-full bg-fg" />}</span>
              </button>
            );
          })}
        </div>

        <div className={cn("transition-opacity", shared ? "opacity-100" : "pointer-events-none opacity-40")} aria-hidden={!shared}>
          <label htmlFor={id + "-url"} className="mb-1.5 block text-sm font-medium text-fg">Link</label>
          <div className="flex gap-2">
            <input id={id + "-url"} readOnly value={shared ? url : "Turn on sharing to get a link"} onFocus={(e) => e.currentTarget.select()} tabIndex={shared ? 0 : -1}
              className="h-9 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 font-mono text-sm text-fg-muted focus:outline-none focus:ring-2 focus:ring-fg/20" />
            <Button variant="outline" disabled={!shared} onClick={() => { copy(url); onCopy?.(); }} className="shrink-0">
              {copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <p className="flex gap-2 rounded-md bg-surface px-3 py-2.5 text-xs text-fg-muted">
          <Info className="mt-px size-3.5 shrink-0" />
          <span>{note ?? "Your name and any messages you send after sharing stay private. Uploaded files aren't included."}</span>
        </p>
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose}>Done</Button>
      </DialogFooter>
    </Dialog>
  );
}
