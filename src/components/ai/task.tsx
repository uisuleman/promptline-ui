import * as React from "react";
import { ChevronDown, FileText, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { Spinner } from "../ui/spinner";
import { Shimmer } from "./loader";

/**
 * Task
 * A collapsible unit of agent work ("Searching the codebase") with the concrete
 * things it touched listed underneath — files, queries, links.
 */
export interface TaskItem { text: React.ReactNode; file?: string }

export function Task({ title, items, status = "done", icon, defaultOpen = true, className }: {
  title: string;
  items: TaskItem[];
  status?: "running" | "done";
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  return (
    <div className={cn("text-sm", className)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="group inline-flex h-7 items-center gap-2 text-fg-muted transition-colors hover:text-fg">
        <span className="[&_svg]:size-4">{status === "running" ? <Spinner className="size-3.5" /> : icon ?? <Search />}</span>
        {status === "running" ? <Shimmer>{title}</Shimmer> : <span className="font-medium">{title}</span>}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <ul id={id} hidden={!open} className="ml-2 mt-2 space-y-2 border-l border-border pl-4" style={{ animation: "pl-in .2s ease-out" }}>
        {items.map((it, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2 text-fg-muted">
            {it.text}
            {it.file && <TaskFile name={it.file} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TaskFile({ name }: { name: string }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-sm border border-border bg-surface px-2 font-mono text-xs text-fg">
      <FileText className="size-3 text-fg-subtle" />{name}
    </span>
  );
}
