import * as React from "react";
import { ApiKeyInput, type KeyStatus } from "../../src";

export function Default() {
  const [key, setKey] = React.useState("sk-live-8f2a91c0d3e4");
  const [status, setStatus] = React.useState<KeyStatus>("idle");
  const verify = () => {
    setStatus("checking");
    setTimeout(() => setStatus(key.startsWith("sk-") ? "valid" : "invalid"), 1000);
  };
  return (
    <ApiKeyInput
      className="w-full max-w-md"
      provider="OpenAI-compatible"
      value={key}
      onValueChange={(v) => { setKey(v); setStatus("idle"); }}
      onVerify={verify}
      status={status}
      helpText="Stored encrypted. Only used for requests you make."
    />
  );
}

export function Invalid() {
  return <ApiKeyInput className="w-full max-w-md" value="abc123" onValueChange={() => {}} onVerify={() => {}} status="invalid" />;
}
