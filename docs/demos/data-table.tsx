import * as React from "react";
import { Download, Trash2, Eye, Copy, RotateCcw, Pencil } from "lucide-react";
import { DataTable, Badge, Button, Avatar, type Column, useToast } from "../../src";

type Run = { id: string; name: string; owner: string; model: string; status: "Completed" | "Running" | "Failed"; tokens: number; cost: number; date: string };
const names = ["Summarise Q3 feedback", "Draft release notes", "Classify support tickets", "Translate help centre", "Generate product copy", "Extract invoice data", "Research competitors", "Write test cases", "Tag user interviews", "Clean CRM records", "Score inbound leads", "Draft investor update", "Summarise sales calls", "Label training data"];
const owners = ["Sam Khan", "Maya Adeyemi", "Chen Wei", "Diego Ruiz"];
const runs: Run[] = names.map((n, i) => ({
  id: String(i + 1), name: n, owner: owners[i % 4], model: i % 3 ? "Swift Pro" : "Swift",
  status: i % 5 === 3 ? "Failed" : i % 4 === 1 ? "Running" : "Completed",
  tokens: 12000 + ((i * 7919) % 90000), cost: +(0.02 + ((i * 37) % 90) / 100).toFixed(2),
  date: new Date(Date.now() - i * 86400e3 * 1.3).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
}));
const initials = (n: string) => n.split(" ").map((x) => x[0]).join("");
const tone = { Completed: "success", Running: "info", Failed: "danger" } as const;

const columns: Column<Run>[] = [
  { id: "name", header: "Run", sortable: true, cell: (r) => r.name },
  { id: "owner", header: "Owner", sortable: true, hideable: true, cell: (r) => <span className="flex items-center gap-2 font-normal"><Avatar size="xs" fallback={initials(r.owner)} />{r.owner}</span> },
  { id: "status", header: "Status", sortable: true, cell: (r) => <Badge dot tone={tone[r.status]}>{r.status}</Badge> },
  { id: "model", header: "Model", hideable: true, defaultHidden: true, cell: (r) => <span className="text-fg-muted">{r.model}</span> },
  { id: "tokens", header: "Tokens", sortable: true, align: "right", hideable: true, cell: (r) => r.tokens.toLocaleString() },
  { id: "cost", header: "Cost", sortable: true, align: "right", cell: (r) => `$${r.cost.toFixed(2)}` },
  { id: "date", header: "Date", hideable: true, cell: (r) => <span className="text-fg-muted">{r.date}</span> },
];

export function Default() {
  const toast = useToast();
  return (
    <DataTable
      className="w-full"
      data={runs}
      columns={columns}
      rowId={(r) => r.id}
      selectable
      pageSize={5}
      searchPlaceholder="Search runs…"
      filters={[{ id: "status", label: "Status", options: ["Completed", "Running", "Failed"].map((s) => ({ value: s, label: s })) }, { id: "owner", label: "Owner", options: owners.map((o) => ({ value: o, label: o })) }]}
      rowActions={(r) => [
        { label: "View run", icon: <Eye />, onSelect: () => toast({ title: `Open "${r.name}"` }) },
        { label: "Rename", icon: <Pencil /> },
        { label: "Duplicate", icon: <Copy /> },
        ...(r.status === "Failed" ? [{ label: "Retry", icon: <RotateCcw />, onSelect: () => toast({ title: "Retrying…" }) }] : []),
        { type: "separator" as const },
        { label: "Delete", icon: <Trash2 />, danger: true, onSelect: () => toast({ title: "Deleted", tone: "error" as const }) },
      ]}
      bulkActions={(rows, clear) => (
        <>
          <Button size="sm" variant="outline" onClick={() => toast({ title: `Exported ${rows.length} runs`, tone: "success" })}><Download />Export</Button>
          <Button size="sm" variant="outline" className="text-danger hover:text-danger" onClick={() => { toast({ title: `Deleted ${rows.length} runs` }); clear(); }}><Trash2 />Delete</Button>
        </>
      )}
    />
  );
}

export function Loading() {
  return <DataTable className="w-full" data={[] as Run[]} columns={columns.slice(0, 4)} rowId={(r) => r.id} loading selectable pageSize={4} />;
}

export function Empty() {
  return (
    <DataTable
      className="w-full"
      data={[] as Run[]}
      columns={columns.slice(0, 4)}
      rowId={(r) => r.id}
      empty={<>Start your first run to see it here. <a className="font-medium text-fg underline underline-offset-4" href="#">New run</a></>}
    />
  );
}

export function Compact() {
  return <DataTable className="w-full" data={runs} columns={columns.filter((c) => ["name", "status", "cost"].includes(c.id))} rowId={(r) => r.id} density="compact" pageSize={6} searchable={false} />;
}
