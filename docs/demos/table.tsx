import * as React from "react";
import { Table, THead, TBody, TR, TH, TD, TCaption, Badge } from "../../src";

export function Default() {
  const rows = [
    { model: "Swift", input: "$0.10", output: "$0.40", ctx: "128K", status: "GA" },
    { model: "Swift Pro", input: "$1.00", output: "$4.00", ctx: "200K", status: "GA" },
    { model: "Nova", input: "$3.00", output: "$15.00", ctx: "1M", status: "Preview" },
  ];
  return (
    <Table wrapperClassName="max-w-2xl">
      <TCaption>Prices per million tokens</TCaption>
      <THead><TR><TH>Model</TH><TH align="right">Input</TH><TH align="right">Output</TH><TH align="right">Context</TH><TH>Status</TH></TR></THead>
      <TBody>
        {rows.map((r) => (
          <TR key={r.model}>
            <TD className="font-medium">{r.model}</TD><TD align="right">{r.input}</TD><TD align="right">{r.output}</TD><TD align="right">{r.ctx}</TD>
            <TD><Badge tone={r.status === "GA" ? "success" : "info"}>{r.status}</Badge></TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
