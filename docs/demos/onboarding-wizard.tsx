import * as React from "react";
import { PenLine, Code2, LineChart, Headphones } from "lucide-react";
import { OnboardingWizard, RadioGroup, KnowledgeUpload, Suggestions, Suggestion, Input, Field, useToast, type KnowledgeFile } from "../../src";

export function Default() {
  const toast = useToast();
  const [useCase, setUseCase] = React.useState<string>();
  const [name, setName] = React.useState("");
  const [files, setFiles] = React.useState<KnowledgeFile[]>([]);
  return (
    <OnboardingWizard
      onFinish={() => toast({ title: "Workspace ready", tone: "success" })}
      steps={[
        {
          id: "use", title: "Your goal", description: "We'll tailor suggestions and defaults.", canContinue: !!useCase,
          content: (
            <RadioGroup variant="card" value={useCase} onValueChange={setUseCase} label="Goal" options={[
              { value: "write", label: <span className="flex items-center gap-2"><PenLine className="size-4" />Writing & content</span> },
              { value: "code", label: <span className="flex items-center gap-2"><Code2 className="size-4" />Coding</span> },
              { value: "data", label: <span className="flex items-center gap-2"><LineChart className="size-4" />Research & analysis</span> },
              { value: "support", label: <span className="flex items-center gap-2"><Headphones className="size-4" />Customer support</span> },
            ]} />
          ),
        },
        {
          id: "workspace", title: "Name your workspace", canContinue: name.trim().length > 1,
          content: <Field label="Workspace name" description="You can change this later.">{(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Design" />}</Field>,
        },
        {
          id: "data", title: "Add knowledge", description: "Upload docs the assistant should know about.", optional: true,
          content: <KnowledgeUpload files={files} onFiles={(l) => setFiles((f) => [...f, ...l.map((x) => ({ id: x.name, name: x.name, size: x.size, status: "ready" as const, chunks: 12 }))])} onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))} />,
        },
        {
          id: "first", title: "Try your first prompt",
          content: <Suggestions>{["Summarise my uploaded docs", "Draft a welcome email", "What can you do?"].map((s) => <Suggestion key={s} suggestion={s} onPick={(v) => toast({ title: v })} />)}</Suggestions>,
        },
      ]}
    />
  );
}
