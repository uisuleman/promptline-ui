import * as React from "react";
import { Message, AssistantAvatar, Avatar, Actions, CopyAction, RetryAction } from "../../src";

export function Default() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Message from="user">Give me three tips for writing better prompts.</Message>
      <Message from="assistant" avatar={<AssistantAvatar />}>
        <p>Here are three that make the biggest difference:</p>
        <ol>
          <li><strong>Give context.</strong> Say who it's for and why.</li>
          <li><strong>Show an example</strong> of the output you want.</li>
          <li><strong>Set constraints</strong> like length, tone, or format.</li>
        </ol>
      </Message>
    </div>
  );
}

export function WithMetaAndActions() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <Message from="user" meta="You · 2:14 PM" avatar={<Avatar fallback="SK" />}>Summarise this thread for the team.</Message>
      <Message
        from="assistant"
        avatar={<AssistantAvatar />}
        meta="Assistant · 2:14 PM"
        footer={<Actions><CopyAction text="The team agreed to ship on Friday." /><RetryAction onClick={() => {}} /></Actions>}
      >
        The team agreed to ship on Friday, pending a final QA pass on the checkout flow. Maya owns the release notes.
      </Message>
    </div>
  );
}
