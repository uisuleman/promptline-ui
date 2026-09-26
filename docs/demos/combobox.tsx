import * as React from "react";
import { Combobox } from "../../src";

const people = ["Ava Patel", "Ben Okafor", "Chen Wei", "Diego Ruiz", "Emma Larsen", "Farah Khan", "Hana Sato", "Ivan Petrov", "Julia Costa", "Kofi Mensah"].map((n) => ({ value: n.toLowerCase().replace(" ", "-"), label: n }));

export function Default() {
  const [v, setV] = React.useState("");
  return <div className="w-72"><Combobox aria-label="Assign to" options={people} value={v} onValueChange={setV} placeholder="Assign to…" /></div>;
}

export function MultipleWithCreate() {
  const [tags, setTags] = React.useState([{ value: "marketing", label: "marketing" }, { value: "research", label: "research" }, { value: "product", label: "product" }, { value: "support", label: "support" }]);
  const [v, setV] = React.useState<string[]>(["research"]);
  return (
    <div className="w-80">
      <Combobox
        aria-label="Tags"
        multiple
        options={tags}
        value={v}
        onValueChange={setV}
        placeholder="Add tags…"
        onCreate={(label) => { const t = { value: label.toLowerCase(), label }; setTags((x) => [...x, t]); setV((x) => [...x, t.value]); }}
      />
    </div>
  );
}
