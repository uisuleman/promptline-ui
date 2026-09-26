"use client";

import * as React from "react";
import { ArrowUp, Braces } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * PromptTemplate
 * Reusable prompts with {{variables}}. Variables become labelled fields automatically;
 * the preview highlights filled and missing values; "Use prompt" is enabled once all are filled.
 * Syntax: {{name}} or {{name:placeholder text}}.
 */
export interface PromptTemplateProps {
  title: string;
  description?: string;
  template: string;
  onUse: (prompt: string, values: Record<string, string>) => void;
  useLabel?: string;
  className?: string;
}

const VAR = /\{\{\s*([a-zA-Z0-9_ ]+?)\s*(?::\s*([^}]*))?\}\}/g;

export function parseTemplate(t: string) {
  const vars: { name: string; hint?: string }[] = [];
  for (const m of t.matchAll(VAR)) if (!vars.some((v) => v.name === m[1])) vars.push({ name: m[1], hint: m[2] });
  return vars;
}
export function fillTemplate(t: string, values: Record<string, string>) {
  return t.replace(VAR, (_, n) => values[n] ?? "");
}
const pretty = (n: string) => n.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function PromptTemplate({ title, description, template, onUse, useLabel = "Use prompt", className }: PromptTemplateProps) {
  const vars = React.useMemo(() => parseTemplate(template), [template]);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const ready = vars.every((v) => values[v.name]?.trim());
  const parts = React.useMemo(() => {
    const out: React.ReactNode[] = [];
    let last = 0, k = 0;
    for (const m of template.matchAll(VAR)) {
      out.push(template.slice(last, m.index));
      const val = values[m[1]]?.trim();
      out.push(val ? <mark key={k++} className="rounded-xs bg-info/10 px-0.5 text-fg">{val}</mark> : <mark key={k++} className="rounded-xs border border-dashed border-border-strong bg-transparent px-1 text-fg-subtle">{pretty(m[1])}</mark>);
      last = m.index! + m[0].length;
    }
    out.push(template.slice(last));
    return out;
  }, [template, values]);

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-bg", className)}>
      <div className="flex items-start gap-3 p-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-2 text-fg-muted"><Braces className="size-4" /></span>
        <div className="min-w-0">
          <p className="text-base font-medium text-fg">{title}</p>
          {description && <p className="text-sm text-fg-muted">{description}</p>}
        </div>
      </div>
      <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
        {vars.map((v, i) => (
          <label key={v.name} className="space-y-1.5 text-sm">
            <span className="font-medium text-fg">{pretty(v.name)}</span>
            <input
              autoFocus={i === 0}
              value={values[v.name] ?? ""}
              onChange={(e) => setValues((s) => ({ ...s, [v.name]: e.target.value }))}
              placeholder={v.hint ?? ""}
              className="h-9 w-full rounded-md border border-border bg-bg px-3 text-base text-fg shadow-xs placeholder:text-fg-subtle focus:border-border-strong focus:outline-none focus:ring-4 focus:ring-fg/5"
            />
          </label>
        ))}
      </div>
      <div className="border-t border-border bg-surface p-4">
        <p className="mb-2 text-xs font-medium text-fg-subtle">Preview</p>
        <p className="whitespace-pre-wrap text-sm leading-6 text-fg-muted">{parts}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-fg-subtle">{vars.filter((v) => values[v.name]?.trim()).length} of {vars.length} filled</span>
          <Button size="sm" disabled={!ready} onClick={() => onUse(fillTemplate(template, values), values)}>{useLabel}<ArrowUp /></Button>
        </div>
      </div>
    </div>
  );
}
