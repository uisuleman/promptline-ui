import * as React from "react";
import { ConfidenceBadge, VerifyNote, UncertainText, MessageBody } from "../../src";

export function Default() {
  return (
    <div className="flex flex-col gap-4">
      <ConfidenceBadge level="high" showHint />
      <ConfidenceBadge level="medium" showHint />
      <ConfidenceBadge level="low" showHint />
    </div>
  );
}

export function InAnAnswer() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <ConfidenceBadge level="medium" />
      <MessageBody>
        <p>
          The recommended adult dose is usually <UncertainText reason="Sources differ between 400 mg and 600 mg">400 mg every 6 hours</UncertainText>,
          not exceeding the daily limit on the label.
        </p>
      </MessageBody>
      <VerifyNote href="https://example.com">This is general information, not medical advice. Check with a pharmacist.</VerifyNote>
    </div>
  );
}
