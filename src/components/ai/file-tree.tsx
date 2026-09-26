import * as React from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * FileTree
 * Project files for coding agents, with change markers: A (added), M (modified), D (deleted).
 * Folders roll up change counts so users see where the agent worked without expanding everything.
 * Keyboard: ↑ ↓ move, → expand / enter folder, ← collapse / go to parent, Enter select.
 */
export type ChangeKind = "added" | "modified" | "deleted";
export interface TreeNode { name: string; path: string; children?: TreeNode[]; change?: ChangeKind }

export interface FileTreeProps {
  nodes: TreeNode[];
  selected?: string;
  onSelect?: (path: string) => void;
  defaultExpanded?: string[];
  className?: string;
}

const mark: Record<ChangeKind, { label: string; cls: string }> = {
  added: { label: "A", cls: "text-success" },
  modified: { label: "M", cls: "text-warning" },
  deleted: { label: "D", cls: "text-danger" },
};

const countChanges = (n: TreeNode): number => (n.children ? n.children.reduce((s, c) => s + countChanges(c), 0) : n.change ? 1 : 0);

export function FileTree({ nodes, selected, onSelect, defaultExpanded = [], className }: FileTreeProps) {
  const [open, setOpen] = React.useState<Set<string>>(new Set(defaultExpanded));
  const [focus, setFocus] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLUListElement>(null);

  const flat: { node: TreeNode; depth: number; parent?: string }[] = [];
  const walk = (list: TreeNode[], depth: number, parent?: string) => list.forEach((n) => { flat.push({ node: n, depth, parent }); if (n.children && open.has(n.path)) walk(n.children, depth + 1, n.path); });
  walk(nodes, 0);

  const toggle = (p: string, v?: boolean) => setOpen((s) => { const n = new Set(s); (v ?? !n.has(p)) ? n.add(p) : n.delete(p); return n; });
  React.useEffect(() => { if (focus) (ref.current?.querySelector(`[data-path="${CSS.escape(focus)}"]`) as HTMLElement | null)?.focus(); }, [focus]);

  return (
    <ul
      ref={ref}
      role="tree"
      aria-label="Files"
      className={cn("select-none py-1 font-mono text-sm", className)}
      onKeyDown={(e) => {
        const i = flat.findIndex((f) => f.node.path === (focus ?? selected));
        const cur = flat[i];
        if (!cur) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setFocus(flat[Math.min(i + 1, flat.length - 1)].node.path); }
        if (e.key === "ArrowUp") { e.preventDefault(); setFocus(flat[Math.max(i - 1, 0)].node.path); }
        if (e.key === "ArrowRight" && cur.node.children) { e.preventDefault(); open.has(cur.node.path) ? setFocus(flat[i + 1]?.node.path ?? cur.node.path) : toggle(cur.node.path, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); cur.node.children && open.has(cur.node.path) ? toggle(cur.node.path, false) : cur.parent && setFocus(cur.parent); }
        if (e.key === "Enter") { e.preventDefault(); cur.node.children ? toggle(cur.node.path) : onSelect?.(cur.node.path); }
      }}
    >
      {flat.map(({ node, depth }, i) => {
        const isDir = !!node.children;
        const isOpen = open.has(node.path);
        const changes = isDir ? countChanges(node) : 0;
        const tabbable = (focus ?? selected ?? flat[0]?.node.path) === node.path;
        return (
          <li
            key={node.path}
            role="treeitem"
            data-path={node.path}
            aria-expanded={isDir ? isOpen : undefined}
            aria-selected={selected === node.path}
            aria-level={depth + 1}
            tabIndex={tabbable ? 0 : -1}
            onClick={() => { setFocus(node.path); isDir ? toggle(node.path) : onSelect?.(node.path); }}
            className={cn(
              "flex h-7 cursor-default items-center gap-1.5 rounded-sm pr-2 text-fg-muted outline-none hover:bg-surface-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fg/20",
              selected === node.path && "bg-surface-2 text-fg",
              node.change === "deleted" && "line-through decoration-danger/50"
            )}
            style={{ paddingLeft: 8 + depth * 16 }}
          >
            {isDir ? <ChevronRight className={cn("size-3.5 shrink-0 transition-transform", isOpen && "rotate-90")} /> : <span className="w-3.5 shrink-0" />}
            {isDir ? (isOpen ? <FolderOpen className="size-4 shrink-0" /> : <Folder className="size-4 shrink-0" />) : <File className="size-4 shrink-0" />}
            <span className="min-w-0 flex-1 truncate">{node.name}</span>
            {isDir && changes > 0 && !isOpen && <span className="size-1.5 rounded-full bg-warning" aria-label={`${changes} changes`} />}
            {node.change && <span className={cn("w-3 text-center text-xs font-semibold", mark[node.change].cls)} aria-label={node.change}>{mark[node.change].label}</span>}
          </li>
        );
      })}
    </ul>
  );
}
