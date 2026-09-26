import * as React from "react";
import { Spinner, Button } from "../../src";

export function Default() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" /><Spinner /><Spinner className="size-6" /><Spinner className="size-6 text-info" label="Loading" />
      <Button disabled variant="outline"><Spinner />Connecting…</Button>
    </div>
  );
}
