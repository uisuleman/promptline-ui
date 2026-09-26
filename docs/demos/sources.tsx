import * as React from "react";
import { Sources } from "../../src";
import { sources } from "./_data";

export function Default() {
  return <Sources className="w-full max-w-2xl" sources={sources} />;
}

export function Expanded() {
  return <Sources className="w-full max-w-2xl" sources={sources} defaultOpen />;
}
