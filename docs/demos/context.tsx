import * as React from "react";
import { Context } from "../../src";

export function Default() {
  return (
    <div className="flex h-56 items-end gap-6">
      <Context used={24000} max={128000} breakdown={{ input: 18000, output: 5200, cached: 800 }} cost={0.0122} modelName="Swift" />
      <Context used={108000} max={128000} breakdown={{ input: 80000, output: 20000, reasoning: 8000 }} cost={0.0634} modelName="Swift Pro" />
      <Context used={126500} max={128000} />
    </div>
  );
}
