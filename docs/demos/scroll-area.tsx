import * as React from "react";
import { ScrollArea } from "../../src";

export function Default() {
  return (
    <ScrollArea maxHeight={240} className="w-64 rounded-lg border border-border">
      <ul className="p-2">
        {Array.from({ length: 30 }).map((_, i) => <li key={i} className="rounded-sm px-2 py-1.5 text-sm text-fg-muted hover:bg-surface-2 hover:text-fg">Conversation {30 - i}</li>)}
      </ul>
    </ScrollArea>
  );
}

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" className="w-full max-w-md">
      <div className="flex gap-3 pb-2">
        {Array.from({ length: 12 }).map((_, i) => <div key={i} className="grid h-24 w-32 shrink-0 place-items-center rounded-md border border-border bg-surface text-sm text-fg-muted">Template {i + 1}</div>)}
      </div>
    </ScrollArea>
  );
}
