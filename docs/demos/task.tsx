import * as React from "react";
import { FileCode2 } from "lucide-react";
import { Task, TaskFile } from "../../src";

export function Default() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Task
        title="Found the auth logic"
        items={[
          { text: "Searched for \"session\" across 214 files" },
          { text: "Read", file: "middleware.ts" },
          { text: "Read", file: "lib/auth/session.ts" },
          { text: <>Found token refresh in <TaskFile name="refresh.ts" /> line 42</> },
        ]}
      />
      <Task title="Updating tests" status="running" icon={<FileCode2 />} items={[{ text: "Editing", file: "auth.test.ts" }]} />
    </div>
  );
}
