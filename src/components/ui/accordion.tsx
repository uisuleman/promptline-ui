"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Accordion
 * Stacked sections that expand in place — FAQs, settings groups, long docs.
 * type="single" keeps one open at a time; "multiple" lets several open. Height animates smoothly.
 * Keyboard: ↑ ↓ move between headers, Home/End jump, Enter/Space toggle.
 */
export interface AccordionItem { value: string; title: React.ReactNode; content: React.ReactNode; icon?: React.ReactNode; disabled?: boolean }

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (v: string[]) => void;
  variant?: "default" | "card";
  className?: string;
}

export function Accordion({ items, type = "single", defaultValue = [], value, onValueChange, variant = "default", className }: AccordionProps) {
  const [inner, setInner] = React.useState<string[]>(defaultValue);
  const open = value ?? inner;
  const id = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const toggle = (v: string) => {
    const next = open.includes(v) ? open.filter((x) => x !== v) : type === "single" ? [v] : [...open, v];
    setInner(next); onValueChange?.(next);
  };
  return (
    <div
      className={cn(variant === "card" ? "space-y-2" : "divide-y divide-border border-y border-border", className)}
      onKeyDown={(e) => {
        const i = refs.current.findIndex((r) => r === document.activeElement);
        if (i < 0) return;
        const go = (n: number) => { e.preventDefault(); refs.current[(n + items.length) % items.length]?.focus(); };
        if (e.key === "ArrowDown") go(i + 1);
        if (e.key === "ArrowUp") go(i - 1);
        if (e.key === "Home") go(0);
        if (e.key === "End") go(items.length - 1);
      }}
    >
      {items.map((it, i) => {
        const isOpen = open.includes(it.value);
        return (
          <div key={it.value} className={cn(variant === "card" && "rounded-lg border border-border bg-bg px-4")}>
            <h3>
              <button
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                id={`${id}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p-${i}`}
                disabled={it.disabled}
                onClick={() => toggle(it.value)}
                className="flex w-full items-center gap-3 py-4 text-left text-base font-medium text-fg transition-colors hover:text-fg/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 disabled:opacity-40 [&_svg]:size-4"
              >
                {it.icon && <span className="text-fg-muted">{it.icon}</span>}
                <span className="flex-1">{it.title}</span>
                <ChevronDown className={cn("shrink-0 text-fg-subtle transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
            </h3>
            <div id={`${id}-p-${i}`} role="region" aria-labelledby={`${id}-h-${i}`} className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className={cn("overflow-hidden transition-[visibility] duration-200", !isOpen && "invisible")} aria-hidden={!isOpen || undefined}>
                <div className="pb-4 text-base text-fg-muted">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
