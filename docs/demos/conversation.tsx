import * as React from "react";
import { Conversation, ConversationContent, Message, AssistantAvatar, PromptInput } from "../../src";

export function Default() {
  const [messages, setMessages] = React.useState([
    { from: "user" as const, text: "What makes an AI chat feel fast?" },
    { from: "assistant" as const, text: "Show a response state within 300ms, stream tokens as they arrive, and keep the input usable while the model works." },
    { from: "user" as const, text: "And when the answer is long?" },
    { from: "assistant" as const, text: "Keep the view pinned to the newest text — unless the user scrolls up to read. Then stop following and offer a button to jump back down." },
  ]);
  const [value, setValue] = React.useState("");
  return (
    <div className="flex h-[420px] w-full flex-col">
      <Conversation>
        <ConversationContent className="gap-6 py-6">
          {messages.map((m, i) => (
            <Message key={i} from={m.from} avatar={m.from === "assistant" ? <AssistantAvatar /> : undefined}>
              {m.text}
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
      <PromptInput
        className="mx-auto max-w-3xl px-4 pb-4"
        value={value}
        onValueChange={setValue}
        onSubmit={(v) => {
          setMessages((m) => [...m, { from: "user", text: v }, { from: "assistant", text: "Noted — the view scrolled to your new message automatically." }]);
          setValue("");
        }}
      />
    </div>
  );
}
