import * as React from "react";
import { ClarifyingQuestion, Message, AssistantAvatar } from "../../src";

export function Default() {
  const [answer, setAnswer] = React.useState<string[] | undefined>();
  const options = [
    { value: "deck", label: "Slide deck", description: "10–12 slides for a pitch meeting", recommended: true },
    { value: "doc", label: "One-page memo", description: "A written summary to share by email" },
    { value: "sheet", label: "Spreadsheet", description: "Numbers and assumptions in a model" },
  ];
  return (
    <div className="w-full max-w-lg">
      <Message from="assistant" avatar={<AssistantAvatar />} header={
        <ClarifyingQuestion
          question="What format should the investor update be in?"
          options={options}
          answered={answer}
          onAnswer={({ values, other }) => setAnswer(other ? [other] : values.map((v) => options.find((o) => o.value === v)!.label))}
          onSkip={() => setAnswer(["Assistant's choice"])}
        />
      }>
        {answer ? `Got it — I'll prepare a ${answer[0].toLowerCase()}.` : null}
      </Message>
    </div>
  );
}

export function MultipleChoice() {
  const [answered, setAnswered] = React.useState<string[] | undefined>();
  return (
    <ClarifyingQuestion
      className="w-full max-w-lg"
      multiple
      question="Which sources should I search?"
      options={[{ value: "web", label: "The web" }, { value: "drive", label: "Google Drive" }, { value: "slack", label: "Slack" }, { value: "notion", label: "Notion" }]}
      answered={answered}
      onAnswer={({ values, other }) => setAnswered([...values, ...(other ? [other] : [])])}
    />
  );
}
