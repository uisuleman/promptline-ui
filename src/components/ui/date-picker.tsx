"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Popover } from "./popover";

/**
 * Calendar · DatePicker · DateRangePicker
 * A keyboard-first calendar grid and the pickers built on it. Locale-aware month and
 * weekday names, min/max and disabled days, single or range selection, and presets.
 * Keys: arrows move a day/week · PageUp/PageDown change month · Home/End week start/end · Enter selects.
 */
export interface DateRange { from?: Date; to?: Date }

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => { const x = new Date(d.getFullYear(), d.getMonth() + n, 1); const last = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate(); return new Date(x.getFullYear(), x.getMonth(), Math.min(d.getDate(), last)); };
export const sameDay = (a?: Date, b?: Date) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtDay = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date | DateRange;
  onSelect?: (value: Date | DateRange) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
  /** 0 = Sunday, 1 = Monday (default) */
  weekStartsOn?: 0 | 1;
  defaultMonth?: Date;
  /** Focus the selected (or today's) day on mount — used inside pickers */
  autoFocus?: boolean;
  className?: string;
}

export function Calendar({ mode = "single", selected, onSelect, min, max, isDisabled, weekStartsOn = 1, defaultMonth, autoFocus, className }: CalendarProps) {
  const today = startOfDay(new Date());
  const initial = (selected instanceof Date ? selected : (selected as DateRange | undefined)?.from) ?? defaultMonth ?? today;
  const [focus, setFocus] = React.useState(startOfDay(initial));
  const [hover, setHover] = React.useState<Date | null>(null);
  const grid = React.useRef<HTMLDivElement>(null);
  const moved = React.useRef(false);
  const month = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const offset = (month.getDay() - weekStartsOn + 7) % 7;
  const days = Array.from({ length: 42 }, (_, i) => addDays(month, i - offset));
  const weeks = days[35].getMonth() !== month.getMonth() ? 5 : 6;
  const weekdays = Array.from({ length: 7 }, (_, i) => addDays(new Date(2024, 0, 7 + weekStartsOn), i).toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2));
  const off = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || !!isDisabled?.(d);
  const range = mode === "range" ? ((selected as DateRange) ?? {}) : null;

  React.useEffect(() => {
    if (autoFocus) requestAnimationFrame(() => grid.current?.querySelector<HTMLElement>('[data-focus="true"]')?.focus());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!moved.current) return;
    grid.current?.querySelector<HTMLElement>('[data-focus="true"]')?.focus();
  }, [focus]);

  const choose = (d: Date) => {
    if (off(d)) return;
    if (mode === "single") return onSelect?.(d);
    const r = range!;
    if (!r.from || r.to) onSelect?.({ from: d, to: undefined });
    else onSelect?.(d < r.from ? { from: d, to: r.from } : { from: r.from, to: d });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1), ArrowRight: () => addDays(focus, 1), ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1), PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
      Home: () => addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7)), End: () => addDays(focus, 6 - ((focus.getDay() - weekStartsOn + 7) % 7)),
    };
    if (map[e.key]) { e.preventDefault(); moved.current = true; setFocus(map[e.key]()); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(focus); }
  };

  const inRange = (d: Date) => {
    if (!range?.from) return false;
    const end = range.to ?? hover;
    if (!end) return false;
    const [a, b] = range.from <= end ? [range.from, end] : [end, range.from];
    return d > a && d < b;
  };

  return (
    <div className={cn("w-[17.5rem] select-none p-3", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => setFocus(addMonths(focus, -1))} aria-label="Previous month" className="grid size-8 place-items-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"><ChevronLeft className="size-4" /></button>
        <p className="text-sm font-medium text-fg" aria-live="polite">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
        <button type="button" onClick={() => setFocus(addMonths(focus, 1))} aria-label="Next month" className="grid size-8 place-items-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"><ChevronRight className="size-4" /></button>
      </div>
      <div role="grid" ref={grid} onKeyDown={onKey} onMouseLeave={() => setHover(null)}>
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((w) => <span key={w} role="columnheader" className="grid h-8 place-items-center text-xs text-fg-subtle">{w}</span>)}
        </div>
        {Array.from({ length: weeks }, (_, r) => (
          <div role="row" key={r} className="grid grid-cols-7">
            {days.slice(r * 7, r * 7 + 7).map((d) => {
              const outside = d.getMonth() !== month.getMonth();
              const isSel = mode === "single" ? sameDay(d, selected as Date) : sameDay(d, range?.from) || sameDay(d, range?.to);
              const mid = inRange(d);
              const disabled = off(d);
              const isFocus = sameDay(d, focus);
              return (
                <div role="gridcell" key={d.toISOString()} aria-selected={isSel || undefined} className={cn("relative p-px", mid && "bg-surface-2", (sameDay(d, range?.from) && (range?.to || hover)) && "rounded-l-md bg-surface-2", sameDay(d, range?.to) && "rounded-r-md bg-surface-2")}>
                  <button type="button" tabIndex={isFocus ? 0 : -1} data-focus={isFocus} disabled={disabled} onClick={() => { setFocus(d); choose(d); }} onMouseEnter={() => setHover(d)}
                    aria-label={d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    aria-current={sameDay(d, today) ? "date" : undefined}
                    className={cn("relative grid h-9 w-full place-items-center rounded-md text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30",
                      isSel ? "bg-fg font-medium text-bg" : outside ? "text-fg-subtle/70 hover:bg-surface-2" : "text-fg hover:bg-surface-2",
                      disabled && "cursor-not-allowed text-fg-subtle/40 line-through hover:bg-transparent")}>
                    {d.getDate()}
                    {sameDay(d, today) && !isSel && <span className="absolute bottom-1 size-1 rounded-full bg-fg" />}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const triggerCls = "inline-flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-border bg-bg px-3 text-left text-sm shadow-xs transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fg/5 focus-visible:border-border-strong";

export interface DatePickerProps { value?: Date; onValueChange: (d: Date | undefined) => void; placeholder?: string; min?: Date; max?: Date; isDisabled?: (d: Date) => boolean; clearable?: boolean; className?: string }

export function DatePicker({ value, onValueChange, placeholder = "Pick a date", min, max, isDisabled, clearable = true, className }: DatePickerProps) {
  return (
    <div className={cn("relative w-full max-w-[16rem]", className)}>
      <Popover label="Choose date" className="w-auto p-0" trigger={<button type="button" className={triggerCls}><CalendarDays className="size-4 shrink-0 text-fg-subtle" /><span className={cn("flex-1 truncate", !value && "text-fg-subtle")}>{value ? fmtDay(value) : placeholder}</span></button>}>
        {(close) => <Calendar autoFocus selected={value} min={min} max={max} isDisabled={isDisabled} onSelect={(d) => { onValueChange(d as Date); close(); }} />}
      </Popover>
      {clearable && value && <button type="button" onClick={() => onValueChange(undefined)} aria-label="Clear date" className="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><X className="size-3.5" /></button>}
    </div>
  );
}

export interface DatePreset { label: string; range: () => DateRange }
export const defaultPresets: DatePreset[] = [
  { label: "Today", range: () => ({ from: startOfDay(new Date()), to: startOfDay(new Date()) }) },
  { label: "Last 7 days", range: () => ({ from: addDays(startOfDay(new Date()), -6), to: startOfDay(new Date()) }) },
  { label: "Last 30 days", range: () => ({ from: addDays(startOfDay(new Date()), -29), to: startOfDay(new Date()) }) },
  { label: "This month", range: () => { const t = new Date(); return { from: new Date(t.getFullYear(), t.getMonth(), 1), to: startOfDay(t) }; } },
];

export interface DateRangePickerProps { value: DateRange; onValueChange: (r: DateRange) => void; presets?: DatePreset[]; placeholder?: string; min?: Date; max?: Date; className?: string }

export function DateRangePicker({ value, onValueChange, presets = defaultPresets, placeholder = "Pick a date range", min, max, className }: DateRangePickerProps) {
  const label = value.from ? (value.to ? (sameDay(value.from, value.to) ? fmtDay(value.from) : `${fmtDay(value.from)} – ${fmtDay(value.to)}`) : `${fmtDay(value.from)} – …`) : null;
  return (
    <div className={cn("w-full max-w-[20rem]", className)}>
    <Popover label="Choose date range" className="w-auto max-w-[calc(100vw-16px)] p-0" trigger={<button type="button" className={triggerCls}><CalendarDays className="size-4 shrink-0 text-fg-subtle" /><span className={cn("flex-1 truncate", !label && "text-fg-subtle")}>{label ?? placeholder}</span></button>}>
      {(close) => (
        <div className="flex flex-col sm:flex-row">
          {presets.length > 0 && (
            <div className="flex gap-1 overflow-x-auto border-b border-border p-2 sm:w-36 sm:flex-col sm:border-b-0 sm:border-r">
              {presets.map((p) => <button key={p.label} type="button" onClick={() => { onValueChange(p.range()); close(); }} className="h-8 shrink-0 rounded-md px-2 text-left text-sm text-fg-muted hover:bg-surface-2 hover:text-fg">{p.label}</button>)}
            </div>
          )}
          <Calendar autoFocus mode="range" selected={value} min={min} max={max} onSelect={(r) => { onValueChange(r as DateRange); if ((r as DateRange).to) close(); }} />
        </div>
      )}
    </Popover>
    </div>
  );
}
