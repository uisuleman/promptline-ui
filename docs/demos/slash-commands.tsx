import * as React from "react";
import { FileText, Image, Languages, ListChecks, Search, Sparkles, Table, Wand2 } from "lucide-react";
import { SlashCommands, PromptInput, type SlashCommand } from "../../src";

const commands: SlashCommand[] = [
  { id: "summarize", label: "Summarize", description: "Condense the conversation or a file", icon: <ListChecks />, group: "Write" },
  { id: "rewrite", label: "Rewrite", description: "Improve clarity and tone", icon: <Wand2 />, group: "Write" },
  { id: "translate", label: "Translate", description: "Into any language", icon: <Languages />, group: "Write", keywords: ["language"] },
  { id: "image", label: "Generate image", description: "Create an image from a prompt", icon: <Image />, group: "Create", keywords: ["picture", "img"] },
  { id: "table", label: "Make a table", description: "Structure the answer as a table", icon: <Table />, group: "Create" },
  { id: "doc", label: "New document", description: "Draft a doc you can edit", icon: <FileText />, group: "Create" },
  { id: "search", label: "Search the web", description: "Answer with fresh sources", icon: <Search />, group: "Tools" },
];

export function Default() {
  const [v, setV] = React.useState("/");
  const [ran, setRan] = React.useState<SlashCommand | null>(null);
  return (
    <div className="flex min-h-[26rem] w-full max-w-xl flex-col justify-end gap-3">
      {ran && <p className="flex items-center gap-2 text-sm text-fg-muted"><Sparkles className="size-4" />Ran <span className="font-medium text-fg">{ran.label}</span></p>}
      <SlashCommands value={v} onValueChange={setV} commands={commands} onRun={setRan}>
        {({ onKeyDown }) => <PromptInput value={v} onValueChange={setV} onKeyDown={onKeyDown} onSubmit={() => setV("")} placeholder="Type / for commands" />}
      </SlashCommands>
    </div>
  );
}
