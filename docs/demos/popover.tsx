import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Popover, Button, Slider, Field, Select } from "../../src";

export function Default() {
  return (
    <Popover label="Model settings" trigger={<Button variant="outline"><SlidersHorizontal />Settings</Button>}>
      {(close) => (
        <div className="space-y-5">
          <div>
            <p className="text-base font-medium text-fg">Model settings</p>
            <p className="text-sm text-fg-muted">Fine-tune how responses are generated.</p>
          </div>
          <Slider label="Temperature" showValue defaultValue={0.7} min={0} max={2} step={0.1} format={(v) => v.toFixed(1)} />
          <Field label="Format">{(p) => <Select {...p} size="sm" defaultValue="md" options={[{ value: "md", label: "Markdown" }, { value: "txt", label: "Plain text" }, { value: "json", label: "JSON" }]} />}</Field>
          <Button size="sm" className="w-full" onClick={close}>Apply</Button>
        </div>
      )}
    </Popover>
  );
}
