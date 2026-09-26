"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

/**
 * UpgradeDialog
 * Paywall for credit exhaustion or locked models. Supports a monthly/yearly toggle.
 * Lead with the reason they hit the wall, then the plan that removes it.
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: { monthly: string; yearly?: string };
  description?: string;
  features: string[];
  recommended?: boolean;
  current?: boolean;
  cta?: string;
}

export interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (planId: string, billing: "monthly" | "yearly") => void;
  title?: string;
  description?: string;
  plans: PricingPlan[];
  yearlyNote?: string;
}

export function UpgradeDialog({ open, onClose, onSelect, title = "Upgrade to keep going", description, plans, yearlyNote = "Save 20%" }: UpgradeDialogProps) {
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly");
  const hasYearly = plans.some((p) => p.price.yearly);
  return (
    <Dialog open={open} onClose={onClose} labelledBy="pl-upgrade-title" className="max-w-2xl">
      <div className="p-6">
        <h2 id="pl-upgrade-title" className="pr-8 text-xl font-semibold text-fg">{title}</h2>
        {description && <p className="mt-1 text-base text-fg-muted">{description}</p>}
        {hasYearly && (
          <div className="mt-6 inline-flex h-9 rounded-md bg-surface-2 p-1 text-sm font-medium" role="radiogroup" aria-label="Billing period">
            {(["monthly", "yearly"] as const).map((b) => (
              <button key={b} type="button" role="radio" aria-checked={billing === b} onClick={() => setBilling(b)} className={cn("inline-flex items-center gap-2 rounded-sm px-3 capitalize transition-colors", billing === b ? "bg-bg text-fg shadow-xs" : "text-fg-muted hover:text-fg")}>
                {b}{b === "yearly" && <span className="text-2xs text-success">{yearlyNote}</span>}
              </button>
            ))}
          </div>
        )}
        <div className={cn("mt-6 grid gap-4", plans.length > 1 && "sm:grid-cols-2")}>
          {plans.map((p) => (
            <div key={p.id} className={cn("flex flex-col rounded-lg border p-5", p.recommended ? "border-fg shadow-sm" : "border-border")}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-medium text-fg">{p.name}</p>
                {p.recommended && <Badge tone="accent">Recommended</Badge>}
                {p.current && <Badge tone="outline">Current</Badge>}
              </div>
              {p.description && <p className="mt-1 text-sm text-fg-muted">{p.description}</p>}
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-fg">{billing === "yearly" && p.price.yearly ? p.price.yearly : p.price.monthly}</span>
                <span className="text-sm text-fg-muted">/ month</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => <li key={f} className="flex gap-2 text-sm text-fg-muted"><Check className="mt-0.5 size-4 shrink-0 text-fg" />{f}</li>)}
              </ul>
              <Button className="mt-6 w-full" variant={p.recommended ? "primary" : "outline"} disabled={p.current} onClick={() => onSelect(p.id, billing)}>
                {p.current ? "Current plan" : p.cta ?? `Get ${p.name}`}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-fg-subtle">Cancel anytime. Prices in USD.</p>
      </div>
    </Dialog>
  );
}
