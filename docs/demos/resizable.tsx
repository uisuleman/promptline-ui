import * as React from "react";
import { ResizablePanels } from "../../src";

const Pane = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="flex h-full flex-col">
    <p className="border-b border-border px-4 py-2.5 text-xs font-medium text-fg-muted">{title}</p>
    <div className="flex-1 p-4 text-sm text-fg-muted">{children}</div>
  </div>
);

export function Default() {
  return (
    <div className="h-80 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-bg">
      <ResizablePanels defaultSizes={[40, 60]} minSizes={[25, 30]} labels={["chat", "canvas"]}>
        <Pane title="Chat"><div className="space-y-3"><p className="ml-auto w-fit rounded-lg bg-surface-2 px-3 py-2 text-fg">Draft a launch email</p><p className="text-fg">Here's a first draft — I've opened it in the canvas.</p></div></Pane>
        <Pane title="Canvas"><p className="font-medium text-fg">Subject: Meet Pantry</p><p className="mt-2">Hi Sam — we built Pantry because planning meals shouldn't take longer than cooking them…</p></Pane>
      </ResizablePanels>
    </div>
  );
}

export function ThreePanels() {
  return (
    <div className="h-72 w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-bg">
      <ResizablePanels defaultSizes={[22, 48, 30]} minSizes={[15, 25, 20]} labels={["files", "editor", "preview"]}>
        <Pane title="Files" /><Pane title="Editor" /><Pane title="Preview" />
      </ResizablePanels>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="h-80 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg">
      <ResizablePanels direction="vertical" defaultSizes={[65, 35]} labels={["output", "logs"]}>
        <Pane title="Output" /><Pane title="Logs"><code className="font-mono text-xs">✓ 12 tool calls · 3.4s</code></Pane>
      </ResizablePanels>
    </div>
  );
}
