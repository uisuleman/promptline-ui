import * as React from "react";
import { Separator, Button } from "../../src";

export function Default() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <Button variant="outline" className="w-full">Continue with Google</Button>
      <Separator label="or" />
      <Button className="w-full">Continue with email</Button>
      <div className="flex h-5 items-center gap-3 text-sm text-fg-muted"><span>Docs</span><Separator vertical /><span>Pricing</span><Separator vertical /><span>Blog</span></div>
    </div>
  );
}
