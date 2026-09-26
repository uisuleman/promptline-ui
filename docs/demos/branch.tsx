import * as React from "react";
import { Branch, Message, AssistantAvatar } from "../../src";

export function Default() {
  const versions = [
    "Ship it Friday — the fix is small and QA has signed off.",
    "I'd wait until Monday. Friday deploys leave no one around if something breaks.",
    "Ship Friday morning behind a feature flag, so you can turn it off without a redeploy.",
  ];
  return (
    <div className="w-full max-w-2xl">
      <Message from="assistant" avatar={<AssistantAvatar />}>
        <Branch branches={versions.map((v) => <p key={v}>{v}</p>)} />
      </Message>
    </div>
  );
}
