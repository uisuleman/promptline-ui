import * as React from "react";
import { Brain, Pencil, Search, Trash2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

/**
 * Memory
 * What the assistant remembers about the user — visible, editable, deletable.
 * - <MemoryUpdated/>: inline chip in the conversation when something new is saved
 * - <MemoryManager/>: settings panel with master toggle, search, edit and delete
 * Users trust memory they can see and control.
 */
export interface MemoryItem { id: string; text: string; date?: string }

export function MemoryUpdated({ text, onManage, className }: { text: string; onManage?: () => void; className?: string }) {
  return (
    <div className={cn("inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface py-1 pl-2 pr-3 text-xs text-fg-muted", className)} role="status">
      <Brain className="size-3.5 shrink-0" />
      <span className="truncate">Memory updated: <span className="text-fg">{text}</span></span>
      {onManage && <button type="button" onClick={onManage} className="shrink-0 font-medium text-fg underline-offset-4 hover:underline">Manage</button>}
    </div>
  );
}

export interface MemoryManagerProps {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  items: MemoryItem[];
  onDelete: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function MemoryManager({ enabled, onEnabledChange, items, onDelete, onEdit, onClearAll, className }: MemoryManagerProps) {
  const [q, setQ] = React.useState("");
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const list = items.filter((i) => i.text.toLowerCase().includes(q.toLowerCase()));

  return (
    <section className={cn("overflow-hidden rounded-lg border border-border bg-bg text-sm", className)} aria-labelledby="pl-mem-title">
      <div className="flex items-start gap-4 p-4">
        <div className="flex-1">
          <h3 id="pl-mem-title" className="text-base font-medium text-fg">Memory</h3>
          <p className="mt-1 text-fg-muted">Let the assistant remember details across chats to personalise answers.</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} label="Use memory" />
      </div>
      <div className={cn("border-t border-border", !enabled && "pointer-events-none opacity-50")} aria-disabled={!enabled}>
        <div className="flex items-center gap-2 px-4 py-3">
          <label className="flex h-8 flex-1 items-center gap-2 rounded-sm border border-border px-2 text-fg-subtle focus-within:border-border-strong">
            <Search className="size-3.5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search memories" aria-label="Search memories" className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none" />
          </label>
          {onClearAll && <Button size="sm" variant="ghost" onClick={onClearAll} className="text-danger hover:bg-danger/10 hover:text-danger">Clear all</Button>}
        </div>
        <ul className="max-h-72 divide-y divide-border overflow-y-auto border-t border-border">
          {list.map((m) => (
            <li key={m.id} className="group flex items-start gap-3 px-4 py-3">
              {editing === m.id ? (
                <form className="flex flex-1 gap-2" onSubmit={(e) => { e.preventDefault(); onEdit?.(m.id, draft); setEditing(null); }}>
                  <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Edit memory" className="h-8 flex-1 rounded-sm border border-border-strong bg-bg px-2 text-sm text-fg focus:outline-none" />
                  <Button size="sm" type="submit">Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                </form>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-fg">{m.text}</p>
                    {m.date && <p className="mt-0.5 text-xs text-fg-subtle">{m.date}</p>}
                  </div>
                  <div className="flex gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                    {onEdit && <button type="button" aria-label="Edit memory" onClick={() => { setEditing(m.id); setDraft(m.text); }} className="grid size-7 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><Pencil className="size-3.5" /></button>}
                    <button type="button" aria-label="Delete memory" onClick={() => onDelete(m.id)} className="grid size-7 place-items-center rounded-sm text-fg-subtle hover:bg-danger/10 hover:text-danger"><Trash2 className="size-3.5" /></button>
                  </div>
                </>
              )}
            </li>
          ))}
          {!list.length && <li className="px-4 py-8 text-center text-fg-subtle">{items.length ? "No memories match your search" : "Nothing saved yet"}</li>}
        </ul>
      </div>
    </section>
  );
}
