import * as React from "react";
import { Field, Input, Switch, Select, Button } from "../../src";

export function Default() {
  const [email, setEmail] = React.useState("sam@");
  const invalid = !/^\S+@\S+\.\S+$/.test(email);
  return (
    <form className="grid w-full max-w-sm gap-6" onSubmit={(e) => e.preventDefault()}>
      <Field label="Workspace name" required description="Shown to everyone you invite.">
        {(p) => <Input {...p} defaultValue="Acme Design" />}
      </Field>
      <Field label="Billing email" error={invalid ? "Enter a valid email address." : undefined}>
        {(p) => <Input {...p} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
      </Field>
      <Field label="Default model" optional>
        {(p) => <Select {...p} defaultValue="swift" options={[{ value: "swift", label: "Swift" }, { value: "swift-pro", label: "Swift Pro" }]} />}
      </Field>
      <Field orientation="horizontal" label="Share usage data" description="Helps us improve answers. Never includes chat content.">
        {(p) => <Switch id={p.id} defaultChecked />}
      </Field>
      <Button type="submit" disabled={invalid}>Save</Button>
    </form>
  );
}
