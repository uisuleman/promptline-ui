import * as React from "react";
import { Copy, Quote, RotateCcw, Pencil, Trash2, Flag } from "lucide-react";
import { ContextMenu, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  return (
    <ContextMenu
      items={[
        { label: "Copy", icon: <Copy />, shortcut: ["⌘", "C"], onSelect: () => toast({ title: "Copied", tone: "success" }) },
        { label: "Quote in reply", icon: <Quote />, onSelect: () => toast({ title: "Quoted" }) },
        { label: "Regenerate", icon: <RotateCcw />, onSelect: () => {} },
        { label: "Edit", icon: <Pencil />, disabled: true },
        { type: "separator" },
        { label: "Report", icon: <Flag />, onSelect: () => {} },
        { label: "Delete message", icon: <Trash2 />, danger: true, onSelect: () => {} },
      ]}
    >
      <div className="grid h-48 w-full max-w-md place-items-center rounded-lg border border-dashed border-border-strong bg-surface text-sm text-fg-muted">
        Right-click (or long-press) here
      </div>
    </ContextMenu>
  );
}
