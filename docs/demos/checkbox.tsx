import * as React from "react";
import { Checkbox } from "../../src";

export function Default() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox label="Remember this device" defaultChecked />
      <Checkbox label="Include sources in answers" description="Adds citations under every response." />
      <Checkbox label="Allow web search" disabled />
    </div>
  );
}

export function SelectAll() {
  const items = ["Chats", "Files", "Memories", "Custom instructions"];
  const [picked, setPicked] = React.useState<string[]>(["Chats"]);
  const all = picked.length === items.length;
  return (
    <div className="w-64 rounded-lg border border-border p-4">
      <Checkbox label="Export everything" checked={all} indeterminate={!all && picked.length > 0} onCheckedChange={(v) => setPicked(v ? items : [])} />
      <div className="mt-3 space-y-3 border-t border-border pl-7 pt-3">
        {items.map((i) => <Checkbox key={i} label={i} checked={picked.includes(i)} onCheckedChange={(v) => setPicked((p) => (v ? [...p, i] : p.filter((x) => x !== i)))} />)}
      </div>
    </div>
  );
}
