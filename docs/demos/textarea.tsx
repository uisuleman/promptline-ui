import * as React from "react";
import { Textarea, Field } from "../../src";

export function Default() {
  return <div className="w-full max-w-md"><Textarea placeholder="Write a system prompt…" /></div>;
}

export function AutoResizeWithCount() {
  const [v, setV] = React.useState("You are a helpful assistant for a design agency. Answer briefly and ask one clarifying question when the request is vague.");
  return (
    <div className="w-full max-w-md">
      <Field label="System prompt" description="Sets the assistant's behaviour for every chat.">
        {(p) => <Textarea {...p} autoResize value={v} onChange={(e) => setV(e.target.value)} maxLength={500} showCount />}
      </Field>
    </div>
  );
}
