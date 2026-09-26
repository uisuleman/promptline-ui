import * as React from "react";
import { RadioGroup } from "../../src";

export function Default() {
  return (
    <RadioGroup
      label="Response length"
      defaultValue="balanced"
      options={[
        { value: "concise", label: "Concise" },
        { value: "balanced", label: "Balanced" },
        { value: "detailed", label: "Detailed" },
      ]}
    />
  );
}

export function Cards() {
  const [v, setV] = React.useState("pro");
  return (
    <RadioGroup
      className="w-full max-w-md"
      variant="card"
      label="Plan"
      value={v}
      onValueChange={setV}
      options={[
        { value: "free", label: "Free", description: "50 messages a day, Swift model" },
        { value: "pro", label: "Pro · $20/mo", description: "Unlimited messages and every model" },
        { value: "team", label: "Team · $30/seat", description: "Shared workspace, admin controls, SSO" },
      ]}
    />
  );
}
