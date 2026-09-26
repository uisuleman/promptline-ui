import * as React from "react";
import { DiffView, diffLines, type HunkDecision, type Hunk } from "../../src";

const hunks: Hunk[] = [
  { id: "h1", header: "@@ export async function POST", lines: diffLines(
`export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await generateText({ model, messages });
  return Response.json(result);
}`,
`export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({ model, messages });
  return result.toTextStreamResponse();
}`) },
  { id: "h2", header: "@@ const model", lines: diffLines(`const model = "swift";`, `const model = process.env.MODEL ?? "swift-pro";\nconst maxDuration = 30;`) },
];

export function Default() {
  const [d, setD] = React.useState<Record<string, HunkDecision>>({});
  return (
    <DiffView
      className="w-full"
      filename="app/api/chat/route.ts"
      hunks={hunks}
      decisions={d}
      onDecide={(id, v) => setD((s) => { const n = { ...s }; v ? (n[id] = v) : delete n[id]; return n; })}
      onDecideAll={(v) => setD(Object.fromEntries(hunks.map((h) => [h.id, v])))}
    />
  );
}
