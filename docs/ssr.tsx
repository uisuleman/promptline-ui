/* Server render entry: turns a route into static HTML for crawlers and first paint. */
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Root } from "./main";
import { parsePath, docPages } from "./lib";
import { registry } from "./registry";

export function render(path: string) {
  globalThis.__PL_SSR_PATH__ = path;
  return renderToString(<Root />);
}

export { parsePath, docPages, registry };
