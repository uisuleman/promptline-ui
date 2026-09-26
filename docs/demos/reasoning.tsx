import * as React from "react";
import { Reasoning, Message, Button, AssistantAvatar } from "../../src";

export function Default() {
  const [streaming, setStreaming] = React.useState(false);
  const run = () => { setStreaming(true); setTimeout(() => setStreaming(false), 2500); };
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Message
        from="assistant"
        avatar={<AssistantAvatar />}
        header={
          <Reasoning isStreaming={streaming} duration={8}>
            <p>The user wants a pricing recommendation for a team of five. The Pro plan covers seats and SSO; Team adds audit logs they didn't ask for.</p>
            <p>Pro is the better fit. I'll mention when Team would make sense.</p>
          </Reasoning>
        }
      >
        {streaming ? null : "Go with Pro — it covers five seats and SSO. Move to Team only if you need audit logs."}
      </Message>
      <Button variant="outline" size="sm" className="self-start" onClick={run} disabled={streaming}>Replay thinking</Button>
    </div>
  );
}
