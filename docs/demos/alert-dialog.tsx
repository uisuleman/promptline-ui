import * as React from "react";
import { AlertDialog, Button, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Revoke API key</Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Revoke this API key?"
        description="Apps using key ending in …a91c will stop working immediately. This can't be undone."
        confirmLabel="Revoke key"
        onConfirm={() => new Promise<void>((r) => setTimeout(() => { r(); toast({ title: "Key revoked", tone: "success" }); }, 800))}
      />
    </>
  );
}

export function TypeToConfirm() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Delete workspace</Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Acme Design?"
        description="All chats, files and assistants in this workspace will be permanently deleted for all 12 members."
        confirmLabel="Delete workspace"
        confirmText="acme-design"
        onConfirm={() => {}}
      />
    </>
  );
}
