import * as React from "react";
import { Sheet, Button, Field, Slider, Select, Switch, Textarea } from "../../src";

export function Default() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Chat settings</Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Chat settings"
        description="Applies to this conversation only."
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save</Button></>}
      >
        <div className="space-y-6">
          <Field label="Model">{(p) => <Select {...p} defaultValue="pro" options={[{ value: "fast", label: "Swift" }, { value: "pro", label: "Swift Pro" }]} />}</Field>
          <Slider label="Temperature" showValue defaultValue={0.7} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
          <Field label="Instructions">{(p) => <Textarea {...p} rows={4} placeholder="How should the assistant respond?" />}</Field>
          <Field orientation="horizontal" label="Web search" description="Allow browsing for this chat.">{(p) => <Switch id={p.id} defaultChecked />}</Field>
        </div>
      </Sheet>
    </>
  );
}

export function BottomDrawer() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Open drawer</Button>
      <Sheet open={open} onOpenChange={setOpen} side="bottom" title="Share chat" description="Anyone with the link can view.">
        <div className="flex gap-2"><input readOnly value="https://acme.ai/s/8f2a91" className="h-9 flex-1 rounded-md border border-border bg-surface px-3 font-mono text-sm text-fg" /><Button>Copy link</Button></div>
      </Sheet>
    </>
  );
}
