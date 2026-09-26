import * as React from "react";
import { NumberInput, Field } from "../../src";

export function Default() {
  const [n, setN] = React.useState(3);
  return <NumberInput value={n} onValueChange={setN} min={1} max={50} aria-label="Seats" />;
}

export function ModelSettings() {
  const [temp, setTemp] = React.useState(0.7);
  const [tokens, setTokens] = React.useState(1024);
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Field label="Temperature" description="Lower is more focused, higher is more creative.">
        {(p) => <NumberInput {...p} value={temp} onValueChange={setTemp} min={0} max={2} step={0.1} />}
      </Field>
      <Field label="Max tokens">
        {(p) => <NumberInput {...p} value={tokens} onValueChange={setTokens} min={1} max={8192} step={64} suffix="tokens" className="max-w-[13rem]" />}
      </Field>
    </div>
  );
}
