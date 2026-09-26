import * as React from "react";
import { ToastView, Button, useToast } from "../../src";

export function Default() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast({ title: "Copied to clipboard", tone: "success" })}>Success</Button>
      <Button variant="outline" onClick={() => toast({ title: "Chat deleted", description: "This conversation was removed.", action: { label: "Undo", onClick: () => {} } })}>With action</Button>
      <Button variant="outline" onClick={() => toast({ title: "Upload failed", description: "Files must be under 20 MB.", tone: "error" })}>Error</Button>
    </div>
  );
}

export function Static() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ToastView title="Copied to clipboard" tone="success" onClose={() => {}} />
      <ToastView title="Chat deleted" description="This conversation was removed." action={{ label: "Undo", onClick: () => {} }} />
      <ToastView title="Upload failed" description="Files must be under 20 MB." tone="error" onClose={() => {}} />
    </div>
  );
}
