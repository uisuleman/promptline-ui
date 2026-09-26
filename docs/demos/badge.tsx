import * as React from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "../../src";

export function Default() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Neutral</Badge>
      <Badge tone="outline">Outline</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success" dot>Live</Badge>
      <Badge tone="warning">Beta</Badge>
      <Badge tone="danger">Failed</Badge>
      <Badge tone="info"><Sparkles />New</Badge>
    </div>
  );
}

export function Sizes() {
  return <div className="flex items-center gap-2"><Badge size="sm" tone="outline">Small</Badge><Badge size="md" tone="outline">Medium</Badge></div>;
}
