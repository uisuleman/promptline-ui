import * as React from "react";
import { Artifact, CodeBlock, useToast } from "../../src";

const html = `<section class="hero">
  <h1>Launch faster</h1>
  <p>Ship your AI product in days, not months.</p>
  <a href="/start">Get started</a>
</section>`;

export function Default() {
  const toast = useToast();
  return (
    <Artifact
      className="h-[360px] w-full max-w-2xl"
      title="Landing hero"
      description="Generated from your brief"
      version="v3"
      copyText={html}
      onDownload={() => toast({ title: "Downloaded hero.html", tone: "success" })}
      onExpand={() => {}}
      onClose={() => {}}
      preview={
        <div className="grid h-full place-items-center bg-surface p-8 text-center">
          <div>
            <h1 className="text-4xl font-semibold text-fg">Launch faster</h1>
            <p className="mt-2 text-lg text-fg-muted">Ship your AI product in days, not months.</p>
            <span className="mt-6 inline-flex h-10 items-center rounded-md bg-fg px-5 text-base font-medium text-bg">Get started</span>
          </div>
        </div>
      }
      code={<CodeBlock code={html} language="html" className="rounded-none border-0" />}
    />
  );
}
