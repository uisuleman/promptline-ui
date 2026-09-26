import * as React from "react";
import { FileTree, type TreeNode } from "../../src";

const tree: TreeNode[] = [
  { name: "app", path: "app", children: [
    { name: "api", path: "app/api", children: [{ name: "chat", path: "app/api/chat", children: [{ name: "route.ts", path: "app/api/chat/route.ts", change: "modified" }] }] },
    { name: "layout.tsx", path: "app/layout.tsx" },
    { name: "page.tsx", path: "app/page.tsx", change: "modified" },
  ] },
  { name: "components", path: "components", children: [
    { name: "chat.tsx", path: "components/chat.tsx", change: "added" },
    { name: "prompt-input.tsx", path: "components/prompt-input.tsx", change: "added" },
    { name: "old-chat.tsx", path: "components/old-chat.tsx", change: "deleted" },
  ] },
  { name: "lib", path: "lib", children: [{ name: "utils.ts", path: "lib/utils.ts" }] },
  { name: "package.json", path: "package.json", change: "modified" },
];

export function Default() {
  const [sel, setSel] = React.useState("components/chat.tsx");
  return (
    <div className="w-72 rounded-lg border border-border bg-bg p-1">
      <FileTree nodes={tree} selected={sel} onSelect={setSel} defaultExpanded={["app", "components"]} />
    </div>
  );
}
