import * as React from "react";
import { Code2, FileSearch, Lightbulb, PenLine } from "lucide-react";
import { Suggestions, Suggestion, SuggestionCard, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const items = ["Write a launch tweet", "Explain this error", "Plan a 3-day trip to Lisbon", "Compare Postgres and MySQL", "Make it shorter"];
  return (
    <Suggestions className="w-full max-w-2xl">
      {items.map((s) => <Suggestion key={s} suggestion={s} onPick={(v) => toast({ title: v })} />)}
    </Suggestions>
  );
}

export function Cards() {
  const toast = useToast();
  const pick = (v: string) => toast({ title: v });
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <SuggestionCard icon={<PenLine />} title="Write a launch post" description="for our new AI feature" onPick={pick} />
      <SuggestionCard icon={<Code2 />} title="Debug my code" description="paste an error and a snippet" onPick={pick} />
      <SuggestionCard icon={<FileSearch />} title="Summarise a PDF" description="key points in five bullets" onPick={pick} />
      <SuggestionCard icon={<Lightbulb />} title="Brainstorm names" description="for a productivity app" onPick={pick} />
    </div>
  );
}
