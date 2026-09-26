import * as React from "react";
import { Shield, Database, CreditCard } from "lucide-react";
import { Accordion } from "../../src";

export function Default() {
  return (
    <Accordion
      className="w-full max-w-lg"
      defaultValue={["train"]}
      items={[
        { value: "train", title: "Do you train on my data?", content: "No. Chats on paid plans are never used for training. On the free plan you can opt out in Settings → Data controls." },
        { value: "limits", title: "What happens when I hit my limit?", content: "You can keep reading your chats. New messages resume when your limit resets, or immediately if you upgrade." },
        { value: "models", title: "Which models are included?", content: "Free includes Swift. Pro includes every model, including Nova and early previews." },
      ]}
    />
  );
}

export function CardsMultiple() {
  return (
    <Accordion
      type="multiple"
      variant="card"
      className="w-full max-w-lg"
      items={[
        { value: "privacy", icon: <Shield />, title: "Privacy", content: "Control memory, history and data sharing." },
        { value: "data", icon: <Database />, title: "Knowledge base", content: "Upload files the assistant can search and cite." },
        { value: "billing", icon: <CreditCard />, title: "Billing", content: "Plans, invoices and usage limits." },
      ]}
    />
  );
}
