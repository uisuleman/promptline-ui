import * as React from "react";
import { Copy, Info, Share, Trash2 } from "lucide-react";
import { Tooltip, Button, KbdGroup } from "../../src";

export function Default() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip label="Copy"><Button variant="ghost" size="icon-sm" aria-label="Copy"><Copy /></Button></Tooltip>
      <Tooltip label="Share"><Button variant="ghost" size="icon-sm" aria-label="Share"><Share /></Button></Tooltip>
      <Tooltip label="Delete" side="bottom"><Button variant="ghost" size="icon-sm" aria-label="Delete"><Trash2 /></Button></Tooltip>
    </div>
  );
}

export function WithShortcut() {
  return (
    <div className="flex items-center gap-6 text-sm text-fg-muted">
      <Tooltip label={<span className="flex items-center gap-2">New chat <KbdGroup keys={["⌘", "N"]} className="[&_kbd]:border-bg/20 [&_kbd]:bg-bg/10 [&_kbd]:text-bg" /></span>}>
        <Button variant="outline">New chat</Button>
      </Tooltip>
      <Tooltip label="Tokens are chunks of text, about ¾ of a word">
        <span tabIndex={0} className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4">1,284 tokens <Info className="size-3.5" /></span>
      </Tooltip>
    </div>
  );
}
