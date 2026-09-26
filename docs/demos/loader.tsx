import * as React from "react";
import { Loader, Shimmer, StreamingCursor } from "../../src";

export function Default() {
  return (
    <div className="flex flex-col gap-6">
      <Loader />
      <Loader variant="pulse" />
      <Loader variant="bars" />
      <Loader label="Searching the web…" />
    </div>
  );
}

export function ShimmerAndCursor() {
  return (
    <div className="flex flex-col gap-4 text-md">
      <Shimmer>Reading 12 sources…</Shimmer>
      <p className="text-fg">Streaming text ends with a cursor<StreamingCursor /></p>
    </div>
  );
}
