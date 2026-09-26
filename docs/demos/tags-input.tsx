import * as React from "react";
import { TagsInput, Field } from "../../src";

export function Default() {
  const [tags, setTags] = React.useState(["pricing", "onboarding", "churn"]);
  return <div className="w-full max-w-md"><TagsInput value={tags} onValueChange={setTags} placeholder="Add a topic" aria-label="Topics" /></div>;
}

export function StopSequences() {
  const [tags, setTags] = React.useState(["\\n\\nHuman:", "END"]);
  return (
    <div className="w-full max-w-md">
      <Field label="Stop sequences" description="Generation stops when the model outputs any of these.">
        {(p) => <TagsInput {...p} value={tags} onValueChange={setTags} max={4} placeholder="Add a sequence" />}
      </Field>
    </div>
  );
}

export function Emails() {
  const [tags, setTags] = React.useState<string[]>([]);
  return (
    <div className="w-full max-w-md">
      <TagsInput value={tags} onValueChange={setTags} placeholder="Paste or type emails" aria-label="Invite by email"
        validate={(t) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? undefined : `“${t}” isn't a valid email`)} />
    </div>
  );
}
