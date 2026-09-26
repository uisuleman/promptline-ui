import * as React from "react";
import { MemoryManager, MemoryUpdated, type MemoryItem } from "../../src";

export function Default() {
  const [enabled, setEnabled] = React.useState(true);
  const [items, setItems] = React.useState<MemoryItem[]>([
    { id: "1", text: "Prefers short, to-the-point answers", date: "Saved Sep 24" },
    { id: "2", text: "Works as a product designer at a startup", date: "Saved Sep 18" },
    { id: "3", text: "Uses Figma and Framer daily", date: "Saved Sep 12" },
    { id: "4", text: "Vegetarian — suggest recipes without meat", date: "Saved Aug 30" },
  ]);
  return (
    <MemoryManager
      className="w-full max-w-lg"
      enabled={enabled}
      onEnabledChange={setEnabled}
      items={items}
      onDelete={(id) => setItems((l) => l.filter((m) => m.id !== id))}
      onEdit={(id, text) => setItems((l) => l.map((m) => (m.id === id ? { ...m, text } : m)))}
      onClearAll={() => setItems([])}
    />
  );
}

export function UpdatedChip() {
  return <MemoryUpdated text="Prefers metric units" onManage={() => {}} />;
}
