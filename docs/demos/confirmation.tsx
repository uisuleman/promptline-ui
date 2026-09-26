import * as React from "react";
import { Confirmation, type ConfirmationState } from "../../src";

export function Default() {
  const [state, setState] = React.useState<ConfirmationState>("pending");
  return (
    <Confirmation
      className="w-full max-w-lg"
      title="Send email to 248 customers?"
      description="The agent drafted a product update and wants to send it now."
      details={[
        { label: "From", value: "updates@acme.com" },
        { label: "To", value: "Customers · Active (248)" },
        { label: "Subject", value: "Your dashboard just got faster" },
      ]}
      risk="high"
      state={state}
      approveLabel="Send email"
      onApprove={() => setState("approved")}
      onDeny={() => setState("denied")}
      onAlwaysAllow={() => setState("approved")}
    />
  );
}
