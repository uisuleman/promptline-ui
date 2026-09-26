import * as React from "react";
import { Kbd, KbdGroup } from "../../src";

export function Default() {
  return (
    <div className="space-y-3 text-sm text-fg-muted">
      <p className="flex items-center gap-2">Open search <KbdGroup keys={["⌘", "K"]} /></p>
      <p className="flex items-center gap-2">Send message <Kbd>Enter</Kbd></p>
      <p className="flex items-center gap-2">New line <KbdGroup keys={["Shift", "Enter"]} /></p>
    </div>
  );
}
