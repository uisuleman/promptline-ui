import * as React from "react";
import { WebPreview } from "../../src";

export function Default() {
  const [url, setUrl] = React.useState("https://acme-launch.vercel.app");
  return (
    <WebPreview
      className="w-full"
      url={url}
      onUrlChange={setUrl}
      height={360}
      logs={[
        { level: "log", time: "12:01:04", message: "Compiled successfully in 812ms" },
        { level: "warn", time: "12:01:05", message: "Image is missing width/height: hero.png" },
        { level: "error", time: "12:01:07", message: "TypeError: Cannot read properties of undefined (reading 'price')" },
      ]}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b border-border px-6 text-sm">
          <span className="font-semibold text-fg">Acme</span>
          <span className="flex gap-6 text-fg-muted"><span>Product</span><span>Pricing</span><span>Docs</span></span>
        </div>
        <div className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <p className="text-4xl font-semibold text-fg">Build with AI</p>
            <p className="mt-2 text-lg text-fg-muted">This preview was generated from a prompt.</p>
          </div>
        </div>
      </div>
    </WebPreview>
  );
}
