import * as React from "react";
import { Collapsible } from "../../src";

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Collapsible trigger="Advanced options">
        <div className="mt-2 space-y-2 rounded-md border border-border p-4 text-sm text-fg-muted">
          <p>Top-p: 0.9</p><p>Frequency penalty: 0.2</p><p>Stop sequences: none</p>
        </div>
      </Collapsible>
    </div>
  );
}

export function CustomTrigger() {
  return (
    <div className="w-full max-w-md">
      <Collapsible
        renderTrigger={({ open, toggle, ...a }) => (
          <button {...a} onClick={toggle} className="flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-left text-sm font-medium text-fg hover:bg-surface">
            3 files attached <span className="text-fg-subtle">{open ? "Hide" : "Show"}</span>
          </button>
        )}
      >
        <ul className="mt-2 space-y-1 px-4 font-mono text-sm text-fg-muted"><li>brief.pdf</li><li>brand.png</li><li>notes.md</li></ul>
      </Collapsible>
    </div>
  );
}
