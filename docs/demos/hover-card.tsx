import * as React from "react";
import { CalendarDays } from "lucide-react";
import { HoverCard, Avatar, Badge } from "../../src";

export function Default() {
  return (
    <p className="max-w-md text-md text-fg">
      This workflow was shared by{" "}
      <HoverCard trigger={<a href="#" className="font-medium underline underline-offset-4">@maya</a>}>
        <div className="flex gap-3">
          <Avatar fallback="MA" size="lg" status="online" />
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-sm font-medium text-fg">Maya Adeyemi <Badge tone="outline">Admin</Badge></p>
            <p className="text-sm text-fg-muted">Design lead at Acme. Builds prompt templates for the whole team.</p>
            <p className="flex items-center gap-1 text-xs text-fg-subtle"><CalendarDays className="size-3" />Joined March 2025</p>
          </div>
        </div>
      </HoverCard>{" "}
      in the Design workspace.
    </p>
  );
}
