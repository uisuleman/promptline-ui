import * as React from "react";
import { Code2, Eye, MessageSquare, FileText } from "lucide-react";
import { Tabs, Badge } from "../../src";

export function Default() {
  return (
    <Tabs
      className="w-full max-w-lg"
      items={[
        { value: "overview", label: "Overview", content: <p className="text-sm text-fg-muted">A summary of usage, cost and top prompts for this workspace.</p> },
        { value: "chats", label: "Chats", badge: <Badge>24</Badge>, content: <p className="text-sm text-fg-muted">All conversations from the last 30 days.</p> },
        { value: "files", label: "Files", content: <p className="text-sm text-fg-muted">Documents uploaded to the knowledge base.</p> },
        { value: "settings", label: "Settings", disabled: true },
      ]}
    />
  );
}

export function Segmented() {
  return (
    <Tabs
      variant="segmented"
      size="sm"
      className="w-full max-w-lg"
      items={[
        { value: "preview", label: "Preview", icon: <Eye />, content: <div className="grid h-24 place-items-center rounded-md border border-border text-sm text-fg-muted">Rendered output</div> },
        { value: "code", label: "Code", icon: <Code2 />, content: <div className="grid h-24 place-items-center rounded-md border border-border font-mono text-sm text-fg-muted">{"<Hero />"}</div> },
      ]}
    />
  );
}

export function Pills() {
  return (
    <Tabs
      variant="pills"
      items={[
        { value: "all", label: "All" },
        { value: "chats", label: "Chats", icon: <MessageSquare /> },
        { value: "docs", label: "Docs", icon: <FileText /> },
      ]}
    />
  );
}
