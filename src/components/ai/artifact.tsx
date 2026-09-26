"use client";

import * as React from "react";
import { Check, Copy, Download, Maximize2, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { useCopy } from "../../lib/hooks";
import { Tooltip } from "../ui/tooltip";

/**
 * Artifact
 * A standalone output (document, code file, chart, app) shown in a panel beside the chat.
 * Header: title + version + actions. Optional Preview / Code tabs.
 */
export interface ArtifactProps {
  title: string;
  description?: string;
  version?: string;
  /** If both are set, shows Preview / Code tabs */
  preview?: React.ReactNode;
  code?: React.ReactNode;
  /** Raw text for the copy action */
  copyText?: string;
  onDownload?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Artifact({ title, description, version, preview, code, copyText, onDownload, onExpand, onClose, children, className }: ArtifactProps) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const { copied, copy } = useCopy();
  const tabs = preview && code;
  const btn = "grid size-8 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg";

  return (
    <section aria-label={title} className={cn("flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-sm", className)}>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border pl-4 pr-2">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 truncate text-base font-medium text-fg">
            {title}
            {version && <span className="rounded-xs bg-surface-2 px-1.5 text-2xs font-medium text-fg-muted">{version}</span>}
          </p>
          {description && <p className="truncate text-xs text-fg-subtle">{description}</p>}
        </div>
        {tabs && (
          <div className="flex h-8 rounded-md bg-surface-2 p-0.5 text-xs font-medium" role="tablist">
            {(["preview", "code"] as const).map((t) => (
              <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("rounded-sm px-3 capitalize transition-colors", tab === t ? "bg-bg text-fg shadow-xs" : "text-fg-muted hover:text-fg")}>{t}</button>
            ))}
          </div>
        )}
        <div className="flex items-center">
          {copyText != null && <Tooltip label={copied ? "Copied" : "Copy"}><button type="button" className={btn} onClick={() => copy(copyText)} aria-label="Copy">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button></Tooltip>}
          {onDownload && <Tooltip label="Download"><button type="button" className={btn} onClick={onDownload} aria-label="Download"><Download className="size-4" /></button></Tooltip>}
          {onExpand && <Tooltip label="Full screen"><button type="button" className={btn} onClick={onExpand} aria-label="Full screen"><Maximize2 className="size-4" /></button></Tooltip>}
          {onClose && <Tooltip label="Close"><button type="button" className={btn} onClick={onClose} aria-label="Close"><X className="size-4" /></button></Tooltip>}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">
        {tabs ? (tab === "preview" ? preview : code) : children ?? preview ?? code}
      </div>
    </section>
  );
}
