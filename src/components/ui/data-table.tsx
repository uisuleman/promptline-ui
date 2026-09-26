import * as React from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Columns3, ListFilter, MoreHorizontal, Search, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Checkbox } from "./checkbox";
import { DropdownMenu, type MenuItem } from "./menu";
import { Button } from "./button";

/**
 * DataTable
 * A self-contained table card: search, faceted filters, sorting, row selection with bulk actions,
 * row action menus, column visibility, rows-per-page and pagination, sticky header,
 * loading skeletons and empty states — no table library required.
 *
 * Define columns once; each can provide a custom `cell`, a `value` for sorting/search/filtering,
 * alignment, width, and whether users can hide it.
 */
export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Value used for sorting, search and filters (defaults to row[id]) */
  value?: (row: T) => string | number;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: number | string;
  /** Can be toggled from the Columns menu */
  hideable?: boolean;
  /** Start hidden */
  defaultHidden?: boolean;
}

export interface Facet { id: string; label: string; options: { value: string; label: string }[] }

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowId: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Faceted filters, e.g. Status → Completed / Running / Failed. `id` must match a column id. */
  filters?: Facet[];
  selectable?: boolean;
  /** Toolbar actions shown while rows are selected */
  bulkActions?: (selected: T[], clear: () => void) => React.ReactNode;
  /** Per-row "…" menu */
  rowActions?: (row: T) => MenuItem[];
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
  /** Extra toolbar content, right side */
  toolbar?: React.ReactNode;
  maxHeight?: number;
  density?: "compact" | "default";
  className?: string;
}

export function DataTable<T>({
  data, columns, rowId, searchable = true, searchPlaceholder = "Search…", filters = [], selectable, bulkActions, rowActions,
  pageSize: initialPageSize = 10, pageSizeOptions = [5, 10, 20, 50], loading, empty, onRowClick, toolbar, maxHeight, density = "default", className,
}: DataTableProps<T>) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id)));
  const [facets, setFacets] = React.useState<Record<string, string[]>>({});

  const val = React.useCallback((c: Column<T>, r: T) => (c.value ? c.value(r) : ((r as any)[c.id] as string | number)), []);
  const cols = columns.filter((c) => !hidden.has(c.id));
  const activeFacets = Object.values(facets).reduce((n, v) => n + v.length, 0);

  const rows = React.useMemo(() => {
    let out = data;
    for (const [id, vals] of Object.entries(facets)) {
      if (!vals.length) continue;
      const c = columns.find((x) => x.id === id);
      if (c) out = out.filter((r) => vals.includes(String(val(c, r))));
    }
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      out = out.filter((r) => columns.some((c) => String(val(c, r) ?? "").toLowerCase().includes(s)));
    }
    if (sort) {
      const c = columns.find((x) => x.id === sort.id);
      if (c) out = [...out].sort((a, b) => {
        const x = val(c, a), y = val(c, b);
        const d = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return sort.dir === "asc" ? d : -d;
      });
    }
    return out;
  }, [data, q, sort, columns, facets, val]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const cur = Math.min(page, pages);
  const view = rows.slice((cur - 1) * pageSize, cur * pageSize);
  const allOnPage = view.length > 0 && view.every((r) => sel.has(rowId(r)));
  const someOnPage = view.some((r) => sel.has(rowId(r)));
  const selectedRows = data.filter((r) => sel.has(rowId(r)));
  const clearSel = () => setSel(new Set());
  const toggleSort = (id: string) => setSort((s) => (s?.id !== id ? { id, dir: "asc" } : s.dir === "asc" ? { id, dir: "desc" } : null));
  const reset = () => { setQ(""); setFacets({}); setPage(1); };
  const rowH = density === "compact" ? "h-10" : "h-12";
  const colCount = cols.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const alignCls = (a?: string) => (a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left");

  return (
    <div className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-xs", className)}>
      {/* Toolbar — swaps to bulk actions while rows are selected, same height so nothing jumps */}
      <div className="flex min-h-14 flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
        {selectable && sel.size > 0 ? (
          <div className="flex flex-1 flex-wrap items-center gap-2" style={{ animation: "pl-in .15s ease-out" }}>
            <span className="inline-flex h-8 items-center gap-2 rounded-md bg-surface-2 pl-3 pr-1 text-sm font-medium tabular-nums text-fg">
              {sel.size} selected
              <button type="button" onClick={clearSel} aria-label="Clear selection" className="grid size-6 place-items-center rounded-sm text-fg-muted hover:bg-border hover:text-fg"><X className="size-3.5" /></button>
            </span>
            {bulkActions?.(selectedRows, clearSel)}
          </div>
        ) : (
          <>
            {searchable && (
              <label className="flex h-8 w-full min-w-40 items-center gap-2 rounded-md border border-border bg-bg px-2.5 text-fg-subtle shadow-xs transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:ring-4 focus-within:ring-fg/5 sm:w-64">
                <Search className="size-4 shrink-0" />
                <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={searchPlaceholder} aria-label="Search table" className="min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none" />
                {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="grid size-5 place-items-center rounded-xs text-fg-subtle hover:text-fg"><X className="size-3.5" /></button>}
              </label>
            )}
            {filters.map((f) => {
              const picked = facets[f.id] ?? [];
              return (
                <DropdownMenu
                  key={f.id}
                  trigger={
                    <Button variant="outline" size="sm" className={cn("border-dashed", picked.length && "border-solid")}>
                      <ListFilter />{f.label}
                      {picked.length > 0 && <span className="ml-0.5 rounded-xs bg-surface-2 px-1.5 text-xs tabular-nums text-fg">{picked.length}</span>}
                    </Button>
                  }
                  items={[
                    ...f.options.map((o) => ({
                      type: "checkbox" as const,
                      label: o.label,
                      hint: String(data.filter((r) => { const c = columns.find((x) => x.id === f.id); return c && String(val(c, r)) === o.value; }).length),
                      checked: picked.includes(o.value),
                      onCheckedChange: (v: boolean) => { setFacets((s) => ({ ...s, [f.id]: v ? [...picked, o.value] : picked.filter((x) => x !== o.value) })); setPage(1); },
                    })),
                    ...(picked.length ? [{ type: "separator" as const }, { label: "Clear filter", onSelect: () => setFacets((s) => ({ ...s, [f.id]: [] })) }] : []),
                  ]}
                />
              );
            })}
            {(activeFacets > 0 || q) && <Button variant="ghost" size="sm" onClick={reset}>Reset<X /></Button>}
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          {toolbar}
          {columns.some((c) => c.hideable) && (
            <DropdownMenu
              align="end"
              trigger={<Button variant="outline" size="sm"><Columns3 /><span className="hidden sm:inline">Columns</span></Button>}
              items={[{ type: "label", label: "Show columns" }, ...columns.filter((c) => c.hideable).map((c) => ({ type: "checkbox" as const, label: c.header, checked: !hidden.has(c.id), onCheckedChange: (v: boolean) => setHidden((h) => { const n = new Set(h); v ? n.delete(c.id) : n.add(c.id); return n; }) }))]}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="min-w-0 overflow-auto" style={{ maxHeight }}>
        <table className="w-full border-separate border-spacing-0 text-left text-sm" aria-busy={loading || undefined} aria-rowcount={rows.length}>
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface text-xs font-medium text-fg-muted">
              {selectable && (
                <th scope="col" className="h-10 w-12 border-b border-border bg-surface pl-4 pr-2">
                  <span className="flex items-center"><Checkbox aria-label="Select all on this page" checked={allOnPage} indeterminate={!allOnPage && someOnPage} onCheckedChange={(v) => setSel((s) => { const n = new Set(s); view.forEach((r) => (v ? n.add(rowId(r)) : n.delete(rowId(r)))); return n; })} /></span>
                </th>
              )}
              {cols.map((c) => {
                const active = sort?.id === c.id;
                const icon = active ? (sort!.dir === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />) : <ChevronsUpDown className="size-3.5 opacity-40" />;
                return (
                  <th key={c.id} scope="col" style={{ width: c.width }} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("h-10 whitespace-nowrap border-b border-border bg-surface px-4 font-medium", alignCls(c.align))}>
                    {c.sortable ? (
                      <button type="button" onClick={() => toggleSort(c.id)}
                        className={cn("-mx-1.5 inline-flex h-7 items-center gap-1 rounded-sm px-1.5 transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20", active && "text-fg", c.align === "right" && "flex-row-reverse")}>
                        {c.header}{icon}
                      </button>
                    ) : c.header}
                  </th>
                );
              })}
              {rowActions && <th scope="col" className="h-10 w-12 border-b border-border bg-surface pr-2"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
                  <tr key={i}>
                    {selectable && <td className={cn(rowH, "border-b border-border pl-4 pr-2")}><span className="block size-4 rounded-xs bg-surface-2" /></td>}
                    {cols.map((c, j) => (
                      <td key={c.id} className={cn(rowH, "border-b border-border px-4")}>
                        <span className={cn("block h-3 animate-pulse rounded-xs bg-surface-2", c.align === "right" && "ml-auto", j === 0 ? "w-4/5" : "w-3/5")} />
                      </td>
                    ))}
                    {rowActions && <td className={cn(rowH, "border-b border-border")} />}
                  </tr>
                ))
              : view.map((r) => {
                  const id = rowId(r), on = sel.has(id);
                  return (
                    <tr key={id} data-selected={on || undefined} onClick={onRowClick ? () => onRowClick(r) : undefined}
                      className={cn("group/row transition-colors hover:bg-surface/70 data-[selected]:bg-surface-2/70", onRowClick && "cursor-pointer")}>
                      {selectable && (
                        <td className={cn(rowH, "border-b border-border pl-4 pr-2")} onClick={(e) => e.stopPropagation()}>
                          <span className="flex items-center"><Checkbox aria-label="Select row" checked={on} onCheckedChange={(v) => setSel((s) => { const n = new Set(s); v ? n.add(id) : n.delete(id); return n; })} /></span>
                        </td>
                      )}
                      {cols.map((c, j) => (
                        <td key={c.id} className={cn(rowH, "whitespace-nowrap border-b border-border px-4 text-fg", alignCls(c.align), c.align === "right" && "tabular-nums", j === 0 && "font-medium")}>
                          {c.cell(r)}
                        </td>
                      ))}
                      {rowActions && (
                        <td className={cn(rowH, "border-b border-border pr-2 text-right")} onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu align="end" items={rowActions(r)} trigger={<Button variant="ghost" size="icon-sm" aria-label="Row actions" className="text-fg-subtle"><MoreHorizontal /></Button>} />
                        </td>
                      )}
                    </tr>
                  );
                })}
            {!loading && !view.length && (
              <tr>
                <td colSpan={colCount} className="h-40 border-b border-border text-center">
                  <div className="mx-auto max-w-xs space-y-2">
                    <p className="text-sm font-medium text-fg">{q || activeFacets ? "No matching results" : "Nothing here yet"}</p>
                    <div className="text-sm text-fg-muted">{empty ?? (q || activeFacets ? <>Try a different search or <button type="button" onClick={reset} className="font-medium text-fg underline underline-offset-4">reset filters</button>.</> : "Data will appear here once it's available.")}</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="-mt-px flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-sm">
        <p className="tabular-nums text-fg-muted">
          {selectable && sel.size > 0 ? `${sel.size} of ${rows.length} selected` : rows.length ? `${(cur - 1) * pageSize + 1}–${Math.min(cur * pageSize, rows.length)} of ${rows.length}` : "0 results"}
        </p>
        <div className="flex items-center gap-4">
          <label className="hidden items-center gap-2 text-fg-muted sm:flex">
            Rows
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} aria-label="Rows per page"
              className="h-8 cursor-pointer rounded-md border border-border bg-bg pl-2 pr-7 text-sm text-fg shadow-xs focus:border-border-strong focus:outline-none">
              {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <span className="mr-2 tabular-nums text-fg-muted">Page {cur} of {pages}</span>
            <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={cur <= 1} onClick={() => setPage(cur - 1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon-sm" aria-label="Next page" disabled={cur >= pages} onClick={() => setPage(cur + 1)}><ChevronRight /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
