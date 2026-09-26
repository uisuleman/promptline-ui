"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Collapsible
 * Show / hide one region with an animated height. The building block behind Reasoning, Tool and Sources.
 * Pass `trigger` for the default chevron button, or render your own via `renderTrigger`.
 */
export interface CollapsibleProps {
  trigger?: React.ReactNode;
  renderTrigger?: (props: { open: boolean; toggle: () => void; "aria-expanded": boolean; "aria-controls": string }) => React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Collapsible({ trigger, renderTrigger, children, open, defaultOpen, onOpenChange, className }: CollapsibleProps) {
  const [inner, setInner] = React.useState(!!defaultOpen);
  const isOpen = open ?? inner;
  const id = React.useId();
  const toggle = () => { setInner(!isOpen); onOpenChange?.(!isOpen); };
  return (
    <div className={className}>
      {renderTrigger ? renderTrigger({ open: isOpen, toggle, "aria-expanded": isOpen, "aria-controls": id }) : (
        <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={toggle} className="inline-flex h-8 items-center gap-2 rounded-sm text-sm font-medium text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20">
          {trigger}<ChevronDown className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
      )}
      <div id={id} className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className={cn("overflow-hidden transition-[visibility] duration-200", !isOpen && "invisible")} aria-hidden={!isOpen || undefined}>{children}</div>
      </div>
    </div>
  );
}
