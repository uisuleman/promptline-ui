import * as React from "react";
import { Globe, Telescope } from "lucide-react";
import { PromptInput, PromptTool, ModelSelector, Attachments, Context, type AttachmentData, type PromptStatus } from "../../src";
import { models } from "./_data";

export function Default() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<PromptStatus>("ready");
  const [model, setModel] = React.useState("swift");
  const [search, setSearch] = React.useState(false);
  const [files, setFiles] = React.useState<AttachmentData[]>([]);

  const submit = () => {
    setValue(""); setFiles([]); setStatus("submitted");
    setTimeout(() => setStatus("streaming"), 800);
    setTimeout(() => setStatus("ready"), 3500);
  };

  return (
    <PromptInput
      className="max-w-2xl"
      value={value}
      onValueChange={setValue}
      onSubmit={submit}
      onStop={() => setStatus("ready")}
      status={status}
      onFiles={(f) => setFiles((prev) => [...prev, ...f.map((x) => ({ id: x.name + Date.now(), name: x.name, size: x.size, type: x.type }))])}
      attachments={files.length ? <Attachments items={files} onRemove={(id) => setFiles((p) => p.filter((a) => a.id !== id))} /> : undefined}
      tools={
        <>
          <PromptTool icon={<Globe />} active={search} onClick={() => setSearch((s) => !s)}>Search</PromptTool>
          <ModelSelector models={models} value={model} onValueChange={setModel} />
        </>
      }
      hint="AI can make mistakes. Check important info."
    />
  );
}

export function Statuses() {
  const states: PromptStatus[] = ["ready", "submitted", "streaming", "error"];
  return (
    <div className="grid w-full max-w-2xl gap-4">
      {states.map((s) => (
        <PromptInput key={s} value={s === "ready" ? "Draft a launch tweet" : ""} onValueChange={() => {}} onSubmit={() => {}} onStop={() => {}} status={s} placeholder={`status="${s}"`} />
      ))}
    </div>
  );
}

export function WithContextAndLimit() {
  const [value, setValue] = React.useState("Summarise the attached 40-page research report into five key findings, each with a supporting quote and a page reference, then list the open questions the authors raise.");
  return (
    <PromptInput
      className="max-w-2xl"
      value={value}
      onValueChange={setValue}
      onSubmit={() => {}}
      maxLength={220}
      tools={<><PromptTool icon={<Telescope />}>Deep research</PromptTool><Context used={98000} max={128000} breakdown={{ input: 71000, output: 19000, reasoning: 8000 }} cost={0.0421} modelName="Swift Pro" /></>}
    />
  );
}
