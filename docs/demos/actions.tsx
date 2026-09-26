import * as React from "react";
import { Actions, CopyAction, RetryAction, ReadAloudAction, ShareAction, FeedbackActions, ActionsMeta, Message, type FeedbackValue, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  const [feedback, setFeedback] = React.useState<FeedbackValue>(null);
  const [reading, setReading] = React.useState(false);
  return (
    <Actions>
      <CopyAction text="Hello world" />
      <RetryAction onClick={() => toast({ title: "Regenerating…" })} />
      <FeedbackActions value={feedback} onValueChange={setFeedback} />
      <ReadAloudAction active={reading} onClick={() => setReading((r) => !r)} />
      <ShareAction onClick={() => toast({ title: "Link copied", tone: "success" })} />
      <ActionsMeta>Swift Pro · 412 tokens · 1.8s</ActionsMeta>
    </Actions>
  );
}

export function RevealOnHover() {
  return (
    <div className="w-full max-w-2xl">
      <Message from="assistant" footer={<Actions reveal="hover"><CopyAction text="…" /><RetryAction onClick={() => {}} /></Actions>}>
        Hover this message to reveal its actions. On touch screens they are always visible.
      </Message>
    </div>
  );
}
