import * as React from "react";
import { ConversationSkeleton, Skeleton } from "../../src";

export function Default() {
  return <ConversationSkeleton className="w-full max-w-2xl" />;
}

export function CustomShapes() {
  return (
    <div className="w-72 space-y-3 rounded-lg border border-border p-4">
      <Skeleton className="aspect-video w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
