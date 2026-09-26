import * as React from "react";
import { Alert, Button } from "../../src";

export function Default() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert tone="info" title="New: memory is now available">Turn it on in Settings to get more personal answers.</Alert>
      <Alert tone="success" title="Knowledge base updated">48 documents were indexed and are ready to search.</Alert>
      <Alert tone="warning" title="Your trial ends in 3 days" action={<Button size="sm" variant="outline">Upgrade</Button>}>Keep your assistants running by choosing a plan.</Alert>
      <Alert tone="danger" title="Webhook failed">We couldn't reach https://api.acme.com/hook (timeout after 10s).</Alert>
    </div>
  );
}

export function Dismissible() {
  const [show, setShow] = React.useState(true);
  return show ? <Alert className="w-full max-w-lg" title="Tip" onDismiss={() => setShow(false)}>Press ⌘K anywhere to search or ask AI.</Alert> : <Button variant="link" onClick={() => setShow(true)}>Show again</Button>;
}
