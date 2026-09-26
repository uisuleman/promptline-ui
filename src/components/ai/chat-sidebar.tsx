import * as React from "react";
import { MoreHorizontal, PanelLeft, PenSquare, Pin, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

/**
 * ChatSidebar
 * Conversation history: new chat, search, pinned chats, date groups (Today, Yesterday, Previous 7 days…),
 * and a footer slot for usage or the account menu.
 */
export interface ChatItem { id: string; title: string; group: string; pinned?: boolean }

export interface ChatSidebarProps {
  chats: ChatItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onMore?: (id: string) => void;
  onCollapse?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ChatSidebar({ chats, activeId, onSelect, onNew, onMore, onCollapse, header, footer, className }: ChatSidebarProps) {
  const [q, setQ] = React.useState("");
  const list = chats.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
  const pinned = list.filter((c) => c.pinned);
  const groups = list.filter((c) => !c.pinned).reduce<[string, ChatItem[]][]>((acc, c) => {
    const g = acc.find(([k]) => k === c.group);
    g ? g[1].push(c) : acc.push([c.group, [c]]);
    return acc;
  }, []);

  const Row = ({ c }: { c: ChatItem }) => (
    <li className="group/row relative">
      <button
        type="button"
        onClick={() => onSelect(c.id)}
        aria-current={c.id === activeId ? "page" : undefined}
        className={cn("flex h-8 w-full items-center rounded-sm px-2 pr-8 text-left text-sm transition-colors", c.id === activeId ? "bg-surface-2 font-medium text-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg")}
      >
        <span className="truncate">{c.title}</span>
      </button>
      {onMore && (
        <button type="button" onClick={() => onMore(c.id)} aria-label={`Options for ${c.title}`} className="absolute right-1 top-1 grid size-6 place-items-center rounded-xs text-fg-subtle opacity-0 hover:bg-border hover:text-fg focus:opacity-100 group-hover/row:opacity-100 [@media(hover:none)]:opacity-100">
          <MoreHorizontal className="size-4" />
        </button>
      )}
    </li>
  );

  return (
    <aside className={cn("flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface", className)} aria-label="Chat history">
      <div className="flex h-14 items-center gap-1 px-3">
        <div className="min-w-0 flex-1 truncate px-1 text-base font-semibold text-fg">{header}</div>
        {onCollapse && <Tooltip label="Close sidebar" side="bottom"><Button variant="ghost" size="icon-sm" onClick={onCollapse} aria-label="Close sidebar"><PanelLeft /></Button></Tooltip>}
        <Tooltip label="New chat" side="bottom"><Button variant="ghost" size="icon-sm" onClick={onNew} aria-label="New chat"><PenSquare /></Button></Tooltip>
      </div>
      <div className="px-3 pb-2">
        <label className="flex h-8 items-center gap-2 rounded-sm border border-border bg-bg px-2 text-fg-subtle focus-within:border-border-strong">
          <Search className="size-3.5 shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" aria-label="Search chats" className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none" />
        </label>
      </div>
      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto px-2 pb-4 pt-2">
        {pinned.length > 0 && (
          <div>
            <p className="flex items-center gap-1 px-2 pb-1 text-xs font-medium text-fg-subtle"><Pin className="size-3" />Pinned</p>
            <ul>{pinned.map((c) => <Row key={c.id} c={c} />)}</ul>
          </div>
        )}
        {groups.map(([g, items]) => (
          <div key={g}>
            <p className="px-2 pb-1 text-xs font-medium text-fg-subtle">{g}</p>
            <ul>{items.map((c) => <Row key={c.id} c={c} />)}</ul>
          </div>
        ))}
        {!list.length && <p className="px-2 py-8 text-center text-sm text-fg-subtle">No chats match "{q}"</p>}
      </nav>
      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </aside>
  );
}
