import * as React from "react";
import { PromptTemplate, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  return (
    <PromptTemplate
      className="w-full max-w-xl"
      title="Cold outreach email"
      description="Shared by Maya · used 128 times"
      template={"Write a short cold email to {{name:e.g. Priya}}, {{role:Head of Growth}} at {{company:Acme}}.\nMention that we help teams like theirs {{value_prop:cut onboarding time in half}}.\nKeep it under 120 words and end with one clear question."}
      onUse={(prompt) => toast({ title: "Prompt inserted", description: prompt.slice(0, 80) + "…" })}
    />
  );
}
