import * as React from "react";
import { ModelSelector, useToast } from "../../src";
import { models, manyModels } from "./_data";

export function Default() {
  const toast = useToast();
  const [model, setModel] = React.useState("swift-pro");
  return (
    <div className="flex h-72 items-end">
      <ModelSelector
        defaultOpen
        models={models}
        value={model}
        onValueChange={setModel}
        onLockedSelect={() => toast({ title: "Nova is on the Pro plan", description: "Open your UpgradeDialog here." })}
      />
    </div>
  );
}

export function SearchableAndGrouped() {
  const [model, setModel] = React.useState("o-large");
  return (
    <div className="flex h-10 items-start">
      <ModelSelector side="bottom" models={manyModels} value={model} onValueChange={setModel} />
    </div>
  );
}
