import * as React from "react";
import { Share } from "lucide-react";
import { ShareDialog, Button, type ShareAccess } from "../../src";

export function Default() {
  const [open, setOpen] = React.useState(false);
  const [access, setAccess] = React.useState<ShareAccess>("private");
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}><Share />Share</Button>
      <ShareDialog open={open} onClose={() => setOpen(false)} access={access} onAccessChange={setAccess} url="https://app.acme.ai/share/7Qk2mX9" />
    </>
  );
}

export function TeamWorkspace() {
  const [open, setOpen] = React.useState(false);
  const [access, setAccess] = React.useState<ShareAccess>("link");
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}><Share />Share with team</Button>
      <ShareDialog open={open} onClose={() => setOpen(false)} access={access} onAccessChange={setAccess} allowPublic={false} title="Share analysis"
        url="https://acme.ai/w/growth/a/31" note="Only people in the Growth workspace can open this link." />
    </>
  );
}
