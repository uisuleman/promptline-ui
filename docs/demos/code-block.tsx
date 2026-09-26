import * as React from "react";
import { CodeBlock } from "../../src";

const code = `import { streamText } from "ai";

// Stream a response token by token
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({ model: "swift-pro", messages });
  return result.toTextStreamResponse();
}`;

export function Default() {
  return <CodeBlock className="w-full max-w-2xl" code={code} language="typescript" filename="app/api/chat/route.ts" />;
}

export function LineNumbersAndHighlight() {
  return <CodeBlock className="w-full max-w-2xl" code={code} language="typescript" showLineNumbers highlightLines={[6, 7]} downloadable />;
}

export function Python() {
  return (
    <CodeBlock
      className="w-full max-w-2xl"
      language="python"
      code={`def chunk(text, size=500):\n    # Split text for embedding\n    return [text[i:i + size] for i in range(0, len(text), size)]\n\nprint(len(chunk("hello " * 400)))`}
    />
  );
}
