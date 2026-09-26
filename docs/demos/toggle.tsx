import * as React from "react";
import { Bold, Italic, Underline, LayoutGrid, List, Globe, Image, Code2 } from "lucide-react";
import { Toggle, ToggleGroup } from "../../src";

export function Default() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed><Bold /></Toggle>
      <Toggle aria-label="Italic"><Italic /></Toggle>
      <Toggle aria-label="Underline"><Underline /></Toggle>
    </div>
  );
}

export function Segmented() {
  const [view, setView] = React.useState("grid");
  return (
    <ToggleGroup
      variant="segmented"
      value={view}
      onValueChange={setView}
      items={[
        { value: "grid", label: <><LayoutGrid />Grid</> },
        { value: "list", label: <><List />List</> },
      ]}
    />
  );
}

export function MultipleTools() {
  const [tools, setTools] = React.useState<string[]>(["web"]);
  return (
    <div className="space-y-3 text-center">
      <ToggleGroup
        type="multiple"
        value={tools}
        onValueChange={setTools}
        items={[
          { value: "web", label: <><Globe />Web</> },
          { value: "image", label: <><Image />Images</> },
          { value: "code", label: <><Code2 />Code</> },
        ]}
      />
      <p className="text-xs text-fg-subtle">Enabled: {tools.join(", ") || "none"}</p>
    </div>
  );
}
