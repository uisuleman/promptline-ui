"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

/**
 * FeedbackDialog
 * Opens after 👎 to learn *why*. One tap on a reason is enough; the text box is optional.
 * The reasons map to issues you can actually fix — keep them specific.
 */
export const defaultReasons = ["Not factually correct", "Didn't follow instructions", "Too long", "Too short", "Unsafe or harmful", "Out of date", "Other"];

export interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { reasons: string[]; comment: string }) => void;
  reasons?: string[];
  title?: string;
}

export function FeedbackDialog({ open, onClose, onSubmit, reasons = defaultReasons, title = "What went wrong?" }: FeedbackDialogProps) {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState("");
  React.useEffect(() => { if (open) { setPicked([]); setComment(""); } }, [open]);
  const toggle = (r: string) => setPicked((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  return (
    <Dialog open={open} onClose={onClose} labelledBy="pl-fb-title" className="max-w-md">
      <form className="p-6" onSubmit={(e) => { e.preventDefault(); onSubmit({ reasons: picked, comment }); }}>
        <h2 id="pl-fb-title" className="pr-8 text-xl font-semibold text-fg">{title}</h2>
        <p className="mt-1 text-sm text-fg-muted">Your feedback helps improve future answers.</p>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Reasons">
          {reasons.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={picked.includes(r)}
              onClick={() => toggle(r)}
              className={cn("h-8 rounded-full border px-3 text-sm transition-colors", picked.includes(r) ? "border-fg bg-fg text-bg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg")}
            >
              {r}
            </button>
          ))}
        </div>
        <label className="mt-6 block text-sm font-medium text-fg" htmlFor="pl-fb-comment">Anything else? <span className="font-normal text-fg-subtle">(optional)</span></label>
        <textarea id="pl-fb-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="What should the answer have said?" className="mt-2 w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-base text-fg shadow-xs placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-4 focus:ring-fg/5" />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!picked.length && !comment.trim()}>Send feedback</Button>
        </div>
      </form>
    </Dialog>
  );
}
