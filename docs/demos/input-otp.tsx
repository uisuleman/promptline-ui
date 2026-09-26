import * as React from "react";
import { InputOTP, Button } from "../../src";

export function Default() {
  const [code, setCode] = React.useState("");
  const [state, setState] = React.useState<"idle" | "checking" | "ok" | "bad">("idle");
  const verify = (c: string) => { setState("checking"); setTimeout(() => setState(c === "123456" ? "ok" : "bad"), 700); };
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div>
        <p className="text-base font-medium text-fg">Check your email</p>
        <p className="text-sm text-fg-muted">We sent a 6-digit code to sam@acme.com. Try 123456.</p>
      </div>
      <InputOTP value={code} onValueChange={(v) => { setCode(v); setState("idle"); }} onComplete={verify} invalid={state === "bad"} disabled={state === "checking"} />
      <p className="h-4 text-xs" aria-live="polite">
        {state === "checking" && <span className="text-fg-muted">Verifying…</span>}
        {state === "bad" && <span className="text-danger">That code didn't match. Try again.</span>}
        {state === "ok" && <span className="text-success">Verified</span>}
      </p>
      <Button variant="link" size="sm">Resend code</Button>
    </div>
  );
}
