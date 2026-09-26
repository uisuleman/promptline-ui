import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "../../lib/cn";
import { Dialog } from "./dialog";
import { Button } from "./button";

/**
 * AlertDialog
 * Interrupts for irreversible actions only (delete workspace, revoke key). Can't be dismissed by
 * clicking outside. Cancel is focused first so Enter never destroys anything by accident.
 * For reversible actions, act immediately and offer Undo in a toast instead.
 * `confirmText` requires typing a word (e.g. the project name) for the most dangerous actions.
 */
export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  destructive?: boolean;
  confirmText?: string;
}

export function AlertDialog({ open, onOpenChange, title, description, confirmLabel = "Continue", cancelLabel = "Cancel", onConfirm, destructive = true, confirmText }: AlertDialogProps) {
  const [typed, setTyped] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { if (open) { setTyped(""); setBusy(false); } }, [open]);
  const blocked = !!confirmText && typed !== confirmText;
  const confirm = async () => { setBusy(true); try { await onConfirm(); onOpenChange(false); } finally { setBusy(false); } };
  return (
    <Dialog open={open} onClose={() => !busy && onOpenChange(false)} labelledBy="pl-alert-title" className="max-w-md" showClose={false} dismissOnBackdrop={false}>
      <div role="alertdialog" aria-labelledby="pl-alert-title" className="p-6">
        <div className="flex gap-4">
          {destructive && <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger/10 text-danger"><AlertTriangle className="size-5" /></span>}
          <div className="min-w-0">
            <h2 id="pl-alert-title" className="text-xl font-semibold text-fg">{title}</h2>
            {description && <div className="mt-1 text-base text-fg-muted">{description}</div>}
          </div>
        </div>
        {confirmText && (
          <label className={cn("mt-6 block text-sm text-fg-muted", destructive && "sm:pl-14")}>
            Type <span className="font-mono font-medium text-fg">{confirmText}</span> to confirm
            <input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} className="mt-2 h-9 w-full rounded-md border border-border bg-bg px-3 font-mono text-base text-fg shadow-xs focus:border-border-strong focus:outline-none focus:ring-4 focus:ring-fg/5" />
          </label>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" data-autofocus onClick={() => onOpenChange(false)} disabled={busy}>{cancelLabel}</Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={confirm} disabled={blocked} loading={busy}>{confirmLabel}</Button>
        </div>
      </div>
    </Dialog>
  );
}
