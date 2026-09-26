import * as React from "react";
import { InlineAI, InlineAITrigger, type InlineAIState } from "../../src";

export function Default() {
  const original = "our app helps teams to work together more better and faster.";
  const [text, setText] = React.useState(original);
  const [state, setState] = React.useState<InlineAIState>("idle");
  const [open, setOpen] = React.useState(true);
  const suggestion = "Our app helps teams collaborate faster.";
  const generate = () => { setState("generating"); setTimeout(() => setState("review"), 1200); };

  return (
    <div className="w-full max-w-md space-y-3">
      <p className="text-md text-fg">
        Welcome to Acme. <mark className="rounded-xs bg-info/15 px-0.5 text-fg">{text}</mark> Start a project in seconds.
      </p>
      {open ? (
        <InlineAI
          original={original}
          suggestion={suggestion}
          state={state}
          onAction={generate}
          onPrompt={generate}
          onAccept={() => { setText(suggestion); setOpen(false); setState("idle"); }}
          onRetry={generate}
          onDiscard={() => { setOpen(false); setState("idle"); }}
        />
      ) : (
        <InlineAITrigger onClick={() => { setText(original); setOpen(true); }} />
      )}
    </div>
  );
}
