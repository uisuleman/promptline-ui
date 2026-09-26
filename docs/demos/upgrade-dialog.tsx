import * as React from "react";
import { UpgradeDialog, Button, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open upgrade dialog</Button>
      <UpgradeDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id, billing) => { setOpen(false); toast({ title: `Selected ${id} (${billing})`, tone: "success" }); }}
        title="You've used today's free messages"
        description="Upgrade for unlimited chats and every model — or come back tomorrow."
        plans={[
          { id: "free", name: "Free", price: { monthly: "$0" }, features: ["50 messages / day", "Swift model", "Standard speed"], current: true },
          { id: "pro", name: "Pro", price: { monthly: "$20", yearly: "$16" }, description: "For daily work", features: ["Unlimited messages", "All models incl. Nova", "Priority speed", "100 MB file uploads"], recommended: true },
        ]}
      />
    </>
  );
}
