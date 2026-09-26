import * as React from "react";
import { UsageMeter } from "../../src";

export function Default() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      <UsageMeter used={1200} limit={5000} resetText="Resets Oct 1" onUpgrade={() => {}} />
      <UsageMeter used={42} limit={50} label="Messages today" resetText="Resets in 6h" onUpgrade={() => {}} />
      <UsageMeter used={98} limit={100} label="Tokens" unit="K" resetText="Almost out" onUpgrade={() => {}} />
    </div>
  );
}

export function Inline() {
  return <UsageMeter className="w-60" variant="inline" used={31} limit={50} label="Messages today" resetText="Resets in 6h" />;
}
