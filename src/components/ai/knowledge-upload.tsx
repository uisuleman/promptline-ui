import * as React from "react";
import { UploadCloud, FileText, Check, AlertCircle, X, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatBytes } from "./attachments";

/**
 * KnowledgeUpload
 * Upload documents the assistant should learn from (RAG / knowledge base).
 * Validates type and size up front with specific messages, then shows each file moving through
 * uploading → processing (reading & indexing) → ready (with chunk count) or error (with retry).
 */
export type KnowledgeStatus = "uploading" | "processing" | "ready" | "error";
export interface KnowledgeFile { id: string; name: string; size: number; status: KnowledgeStatus; progress?: number; chunks?: number; error?: string }

export interface KnowledgeUploadProps {
  files: KnowledgeFile[];
  onFiles: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  /** e.g. [".pdf", ".docx", ".md", ".txt", ".csv"] */
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  /** Storage used / limit, shown in the footer */
  usage?: { used: number; limit: number };
  className?: string;
}

export function KnowledgeUpload({ files, onFiles, onRemove, onRetry, accept = [".pdf", ".docx", ".md", ".txt", ".csv"], maxSize = 20 * 1048576, maxFiles = 50, usage, className }: KnowledgeUploadProps) {
  const [drag, setDrag] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const input = React.useRef<HTMLInputElement>(null);

  const take = (list: File[]) => {
    const errs: string[] = [], ok: File[] = [];
    list.forEach((f) => {
      const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
      if (!accept.includes(ext)) errs.push(`${f.name}: ${ext.toUpperCase().slice(1)} files aren't supported`);
      else if (f.size > maxSize) errs.push(`${f.name}: larger than ${formatBytes(maxSize)}`);
      else ok.push(f);
    });
    if (files.length + ok.length > maxFiles) { errs.push(`You can add up to ${maxFiles} files`); ok.splice(maxFiles - files.length); }
    setErrors(errs);
    if (ok.length) onFiles(ok);
  };
  const ready = files.filter((f) => f.status === "ready").length;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => input.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); take(Array.from(e.dataTransfer.files)); }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20",
          drag ? "border-fg bg-surface-2" : "border-border-strong bg-surface hover:bg-surface-2/60"
        )}
      >
        <span className={cn("grid size-10 place-items-center rounded-full border border-border bg-bg shadow-xs transition-transform", drag && "scale-110")}><UploadCloud className="size-5 text-fg-muted" /></span>
        <p className="text-base font-medium text-fg">{drag ? "Drop to upload" : "Drop files or click to upload"}</p>
        <p className="text-xs text-fg-subtle">{accept.map((a) => a.slice(1).toUpperCase()).join(", ")} · up to {formatBytes(maxSize)} each</p>
        <input ref={input} type="file" multiple hidden accept={accept.join(",")} onChange={(e) => { take(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
      </div>

      {errors.length > 0 && (
        <ul className="space-y-1 rounded-md border border-danger/25 bg-danger/[0.04] p-3 text-xs text-danger" role="alert">
          {errors.map((e) => <li key={e} className="flex gap-2"><AlertCircle className="mt-px size-3.5 shrink-0" />{e}</li>)}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-3 py-2.5">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-sm", f.status === "error" ? "bg-danger/10 text-danger" : "bg-surface-2 text-fg-muted")}><FileText className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{f.name}</p>
                <p className={cn("flex items-center gap-1.5 text-xs", f.status === "error" ? "text-danger" : "text-fg-subtle")} aria-live="polite">
                  {f.status === "uploading" && <>Uploading · {Math.round(f.progress ?? 0)}%</>}
                  {f.status === "processing" && <><Loader2 className="size-3 animate-spin" />Reading and indexing…</>}
                  {f.status === "ready" && <>{formatBytes(f.size)} · {f.chunks ?? 0} chunks</>}
                  {f.status === "error" && (f.error ?? "Couldn't process this file")}
                </p>
                {f.status === "uploading" && <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-fg transition-[width] duration-300" style={{ width: `${f.progress ?? 0}%` }} /></div>}
              </div>
              {f.status === "ready" && <Check className="size-4 shrink-0 text-success" aria-label="Ready" />}
              {f.status === "error" && onRetry && <button type="button" onClick={() => onRetry(f.id)} aria-label={`Retry ${f.name}`} className="grid size-7 place-items-center rounded-sm text-fg-muted hover:bg-surface-2 hover:text-fg"><RotateCcw className="size-3.5" /></button>}
              {onRemove && <button type="button" onClick={() => onRemove(f.id)} aria-label={`Remove ${f.name}`} className="grid size-7 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg"><X className="size-3.5" /></button>}
            </li>
          ))}
        </ul>
      )}

      {(files.length > 0 || usage) && (
        <div className="flex items-center justify-between text-xs text-fg-subtle">
          <span>{ready} of {files.length} ready</span>
          {usage && <span className="tabular-nums">{formatBytes(usage.used)} of {formatBytes(usage.limit)} used</span>}
        </div>
      )}
    </div>
  );
}
