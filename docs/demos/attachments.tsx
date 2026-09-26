import * as React from "react";
import { Attachments, type AttachmentData } from "../../src";
import { imageThumb } from "./_data";

export function Default() {
  const [items, setItems] = React.useState<AttachmentData[]>([
    { id: "1", name: "Q3-board-deck.pdf", size: 4_200_000 },
    { id: "2", name: "users-export.csv", status: "uploading", progress: 64 },
    { id: "3", name: "app.tsx", size: 8200 },
    { id: "4", name: "interview.mov", status: "error" },
    { id: "5", name: "moodboard.png", url: imageThumb },
    { id: "6", name: "logo.png", url: imageThumb, status: "uploading", progress: 30 },
  ]);
  return (
    <Attachments
      className="max-w-2xl"
      items={items}
      onRemove={(id) => setItems((l) => l.filter((a) => a.id !== id))}
      onRetry={(id) => setItems((l) => l.map((a) => (a.id === id ? { ...a, status: "ready", size: 18_000_000 } : a)))}
    />
  );
}
