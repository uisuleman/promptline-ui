import * as React from "react";
import { VoiceInput, PromptInput, type VoiceState } from "../../src";

export function Default() {
  const [state, setState] = React.useState<VoiceState>("recording");
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4">
      <VoiceInput className="w-full" state={state} onStart={() => setState("recording")} onCancel={() => setState("idle")} onDone={() => { setState("processing"); setTimeout(() => setState("idle"), 1200); }} />
      <p className="text-xs text-fg-subtle">state = "{state}"</p>
    </div>
  );
}

export function InPromptInput() {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState<VoiceState>("idle");
  return (
    <PromptInput
      className="max-w-2xl"
      value={value}
      onValueChange={setValue}
      onSubmit={() => setValue("")}
      tools={
        <VoiceInput
          state={state}
          onStart={() => setState("recording")}
          onCancel={() => setState("idle")}
          onDone={() => { setState("processing"); setTimeout(() => { setValue("Book a table for two on Friday at 8"); setState("idle"); }, 900); }}
        />
      }
    />
  );
}
