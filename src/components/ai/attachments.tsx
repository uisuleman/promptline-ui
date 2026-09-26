"use client";

import * as React from "react";
import { FileCode2, FileImage, FileSpreadsheet, FileText, FileAudio, RotateCcw, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Attachments
 * File and image chips for the prompt input and sent messages.
 * States: uploading (progress ring) · ready · error (retry). Images render as thumbnails.
 */
export interface AttachmentData {
  id: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  status?: "uploading" | "ready" | "error";
  progress?: number;
}

const ext = (n: string) => n.split(".").pop()?.toLowerCase() ?? "";
const isImage = (a: AttachmentData) => a.type?.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "avif"].includes(ext(a.name));
const iconFor = (n: string) => {
  const e = ext(n);
  if (["csv", "xlsx", "xls"].includes(e)) return FileSpreadsheet;
  if (["js", "ts", "tsx", "jsx", "py", "json", "html", "css", "md"].includes(e)) return FileCode2;
  if (["mp3", "wav", "m4a"].includes(e)) return FileAudio;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(e)) return FileImage;
  return FileText;
};
export const formatBytes = (b?: number) => (b == null ? "" : b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`);

function Progress({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5 -rotate-90" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2" className="stroke-border" />
      <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-fg transition-[stroke-dashoffset] duration-300" strokeDasharray={50.3} strokeDashoffset={50.3 * (1 - value / 100)} />
    </svg>
  );
}

export interface AttachmentProps { data: AttachmentData; onRemove?: () => void; onRetry?: () => void; className?: string }

export function Attachment({ data, onRemove, onRetry, className }: AttachmentProps) {
  const { name, size, status = "ready", progress = 0, url } = data;
  const Icon = iconFor(name);
  const err = status === "error";

  if (isImage(data) && url) {
    return (
      <div className={cn("group relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-surface", err && "border-danger/50", className)} title={name}>
        <img src={url} alt={name} className={cn("size-full object-cover", status === "uploading" && "opacity-40")} />
        {status === "uploading" && <div className="absolute inset-0 grid place-items-center"><Progress value={progress} /></div>}
        {onRemove && <RemoveBtn name={name} onRemove={onRemove} />}
      </div>
    );
  }

  return (
    <div className={cn("group relative flex h-14 w-60 shrink-0 items-center gap-3 rounded-md border bg-bg p-2 pr-3", err ? "border-danger/40" : "border-border", className)}>
      <div className={cn("relative grid size-10 shrink-0 place-items-center rounded-sm", err ? "bg-danger/10 text-danger" : "bg-surface-2 text-fg-muted")}>
        {status === "uploading" ? <Progress value={progress} /> : <Icon className="size-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{name}</p>
        <p className={cn("text-xs", err ? "text-danger" : "text-fg-subtle")}>
          {status === "uploading" ? `Uploading · ${Math.round(progress)}%` : err ? "Upload failed" : [ext(name).toUpperCase(), formatBytes(size)].filter(Boolean).join(" · ")}
        </p>
      </div>
      {err && onRetry && (
        <button type="button" onClick={onRetry} aria-label={`Retry ${name}`} className="grid size-7 place-items-center rounded-sm text-fg-muted hover:bg-surface-2 hover:text-fg"><RotateCcw className="size-3.5" /></button>
      )}
      {onRemove && <RemoveBtn name={name} onRemove={onRemove} />}
    </div>
  );
}

function RemoveBtn({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${name}`}
      className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-fg text-bg opacity-0 shadow-sm transition-opacity focus:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
    >
      <X className="size-3" />
    </button>
  );
}

export function Attachments({ items, onRemove, onRetry, className }: { items: AttachmentData[]; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((a) => (
        <Attachment key={a.id} data={a} onRemove={onRemove && (() => onRemove(a.id))} onRetry={onRetry && (() => onRetry(a.id))} />
      ))}
    </div>
  );
}
