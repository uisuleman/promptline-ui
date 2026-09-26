import * as React from "react";
import { StatusBanner } from "../../src";

export function Default() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <StatusBanner kind="error" onAction={() => {}} />
      <StatusBanner kind="rate-limit" countdown={24} onAction={() => {}} />
      <StatusBanner kind="credits" onAction={() => {}} />
      <StatusBanner kind="offline" onAction={() => {}} />
      <StatusBanner kind="content-policy" onAction={() => {}} />
    </div>
  );
}

export function Dismissible() {
  const [show, setShow] = React.useState(true);
  return show ? (
    <StatusBanner className="w-full max-w-2xl" kind="info" title="Swift Pro is now 2× faster" description="Same price, same quality. Nothing to change on your side." onDismiss={() => setShow(false)} />
  ) : (
    <button className="text-sm text-fg-muted underline" onClick={() => setShow(true)}>Show again</button>
  );
}
