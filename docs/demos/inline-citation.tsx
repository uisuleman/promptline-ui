import * as React from "react";
import { InlineCitation, MessageBody } from "../../src";
import { sources } from "./_data";

export function Default() {
  return (
    <MessageBody className="max-w-2xl">
      <p>
        Streaming a response reduces how long people feel they're waiting
        <InlineCitation sources={[sources[0]]} />. When the shape of the content is known, skeleton placeholders
        work better than spinners
        <InlineCitation sources={[sources[1], sources[2]]} />.
      </p>
    </MessageBody>
  );
}
