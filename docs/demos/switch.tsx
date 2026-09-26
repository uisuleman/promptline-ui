import * as React from "react";
import { Switch, Field } from "../../src";

export function Default() {
  const [on, setOn] = React.useState(true);
  return (
    <div className="flex items-center gap-6">
      <Switch checked={on} onCheckedChange={setOn} label="Web search" />
      <Switch size="sm" defaultChecked label="Small" />
      <Switch disabled label="Disabled" />
    </div>
  );
}

export function SettingsList() {
  return (
    <div className="w-full max-w-md divide-y divide-border rounded-lg border border-border">
      {[
        ["Web search", "Let the assistant look things up online.", true],
        ["Memory", "Remember details across chats.", true],
        ["Improve the model", "Use my chats to train future models.", false],
      ].map(([l, d, on]) => (
        <Field key={String(l)} className="p-4" orientation="horizontal" label={l as string} description={d as string}>
          {(p) => <Switch id={p.id} defaultChecked={on as boolean} />}
        </Field>
      ))}
    </div>
  );
}
