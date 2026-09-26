import * as React from "react";
import { MentionPicker, MentionChip, PromptInput, type MentionItem } from "../../src";

const items: MentionItem[] = [
  { id: "f1", label: "pricing-2026.pdf", type: "file", description: "248 KB" },
  { id: "f2", label: "onboarding.md", type: "file", description: "docs/" },
  { id: "f3", label: "q3-metrics.csv", type: "file", description: "data/" },
  { id: "a1", label: "Research agent", type: "agent", description: "Web + PDFs" },
  { id: "a2", label: "SQL analyst", type: "agent", description: "Warehouse" },
  { id: "p1", label: "Maya Chen", type: "person", description: "Design" },
  { id: "p2", label: "Omar Farooq", type: "person", description: "Engineering" },
];

export function Default() {
  const [v, setV] = React.useState("Compare @");
  const [picked, setPicked] = React.useState<MentionItem[]>([items[0]]);
  return (
    <div className="flex min-h-[23rem] w-full max-w-xl flex-col justify-end">
      <MentionPicker value={v} onValueChange={setV} items={items} selected={picked.map((p) => p.id)} onSelect={(i) => setPicked((p) => [...p, i])}>
        {({ onKeyDown }) => (
          <PromptInput value={v} onValueChange={setV} onKeyDown={onKeyDown} onSubmit={() => setV("")} placeholder="Type @ to add context"
            attachments={picked.length ? picked.map((p) => <MentionChip key={p.id} item={p} onRemove={() => setPicked((x) => x.filter((y) => y.id !== p.id))} />) : undefined} />
        )}
      </MentionPicker>
    </div>
  );
}
