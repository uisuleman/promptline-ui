import * as React from "react";
import { FeedbackDialog, Actions, FeedbackActions, type FeedbackValue, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const [value, setValue] = React.useState<FeedbackValue>(null);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Actions>
        <FeedbackActions value={value} onValueChange={(v) => { setValue(v); if (v === "down") setOpen(true); }} />
        <span className="ml-2 text-xs text-fg-subtle">← click thumbs down</span>
      </Actions>
      <FeedbackDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(d) => { setOpen(false); toast({ title: "Thanks for the feedback", description: d.reasons.join(", ") || undefined, tone: "success" }); }}
      />
    </>
  );
}
