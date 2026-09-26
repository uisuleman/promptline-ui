import * as React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, Button, Field, Input, Textarea, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>New assistant</Button>
      <Dialog open={open} onClose={() => setOpen(false)} labelledBy="new-assistant">
        <DialogHeader>
          <DialogTitle id="new-assistant">Create an assistant</DialogTitle>
          <DialogDescription>Give it a name and tell it how to behave.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field label="Name">{(p) => <Input {...p} placeholder="Support bot" data-autofocus />}</Field>
          <Field label="Instructions" optional>{(p) => <Textarea {...p} rows={4} placeholder="Answer in a friendly tone…" />}</Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { setOpen(false); toast({ title: "Assistant created", tone: "success" }); }}>Create</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
