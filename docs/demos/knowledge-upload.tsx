import * as React from "react";
import { KnowledgeUpload, type KnowledgeFile } from "../../src";

export function Default() {
  const [files, setFiles] = React.useState<KnowledgeFile[]>([
    { id: "1", name: "brand-guidelines.pdf", size: 4_200_000, status: "ready", chunks: 86 },
    { id: "2", name: "pricing-faq.md", size: 18_000, status: "processing" },
    { id: "3", name: "support-macros.csv", size: 1_200_000, status: "uploading", progress: 42 },
    { id: "4", name: "scanned-contract.pdf", size: 9_800_000, status: "error", error: "No readable text found — try an OCR'd copy" },
  ]);

  const simulate = (id: string) => {
    let p = 0;
    const t = setInterval(() => {
      p += 20;
      setFiles((l) => l.map((f) => (f.id === id ? (p < 100 ? { ...f, progress: p } : { ...f, status: "processing" }) : f)));
      if (p >= 100) { clearInterval(t); setTimeout(() => setFiles((l) => l.map((f) => (f.id === id ? { ...f, status: "ready", chunks: 12 + Math.round(f.size / 50000) } : f))), 1200); }
    }, 250);
  };

  return (
    <KnowledgeUpload
      className="w-full max-w-lg"
      files={files}
      usage={{ used: files.reduce((s, f) => s + f.size, 0), limit: 100 * 1048576 }}
      onFiles={(list) => list.forEach((f) => { const id = `${Date.now()}-${Math.random()}`; setFiles((l) => [...l, { id, name: f.name, size: f.size, status: "uploading", progress: 0 }]); simulate(id); })}
      onRemove={(id) => setFiles((l) => l.filter((f) => f.id !== id))}
      onRetry={(id) => { setFiles((l) => l.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 0 } : f))); simulate(id); }}
    />
  );
}
