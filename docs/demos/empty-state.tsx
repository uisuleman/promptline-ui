import * as React from "react";
import { Sparkles, PenLine, Code2, FileSearch, Lightbulb } from "lucide-react";
import { EmptyState, SuggestionCard, Suggestions, Suggestion, PromptInput, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const pick = (v: string) => toast({ title: v });
  return (
    <EmptyState icon={<Sparkles />} title="What can I help with?" description="Write, analyse files, search the web, or brainstorm.">
      <div className="grid gap-3 text-left sm:grid-cols-2">
        <SuggestionCard icon={<PenLine />} title="Write a launch post" description="for our new AI feature" onPick={pick} />
        <SuggestionCard icon={<Code2 />} title="Debug my code" description="paste an error and a snippet" onPick={pick} />
        <SuggestionCard icon={<FileSearch />} title="Summarise a PDF" description="key points in five bullets" onPick={pick} />
        <SuggestionCard icon={<Lightbulb />} title="Brainstorm names" description="for a productivity app" onPick={pick} />
      </div>
    </EmptyState>
  );
}

export function WithPromptInput() {
  const [value, setValue] = React.useState("");
  return (
    <EmptyState title="Good evening, Sam" description="What are we working on today?">
      <PromptInput value={value} onValueChange={setValue} onSubmit={() => setValue("")} />
      <Suggestions className="mt-4 justify-center">
        {["Plan my week", "Reply to an email", "Explain a concept"].map((s) => <Suggestion key={s} suggestion={s} onPick={setValue} />)}
      </Suggestions>
    </EmptyState>
  );
}
