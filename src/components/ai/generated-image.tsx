"use client";

import * as React from "react";
import { Download, Expand, RotateCcw, ImageOff } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";
import { Shimmer } from "./loader";

/**
 * GeneratedImage
 * Image output with honest states: generating (progress + prompt echo) → done → error.
 * Reserve the final aspect ratio up front so the layout never jumps.
 */
export interface GeneratedImageProps {
  src?: string;
  alt: string;
  status?: "generating" | "done" | "error";
  progress?: number;
  aspectRatio?: string;
  onRetry?: () => void;
  onExpand?: () => void;
  className?: string;
}

export function GeneratedImage({ src, alt, status = "done", progress, aspectRatio = "1 / 1", onRetry, onExpand, className }: GeneratedImageProps) {
  const download = () => { if (src) Object.assign(document.createElement("a"), { href: src, download: "image.png" }).click(); };
  return (
    <figure className={cn("group relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface", className)} style={{ aspectRatio }}>
      {status === "done" && src && <img src={src} alt={alt} className="size-full object-cover" style={{ animation: "pl-in .4s ease-out" }} />}

      {status === "generating" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-fg/[0.05] to-transparent" style={{ animation: "pl-shimmer-x 1.8s infinite" }} />
          </div>
          <Shimmer className="text-sm">Creating image…</Shimmer>
          {progress != null && (
            <div className="h-1 w-32 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-fg transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
          <p className="line-clamp-2 max-w-60 text-xs text-fg-subtle">{alt}</p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <ImageOff className="size-6 text-fg-subtle" />
          <p className="text-sm text-fg-muted">Couldn't create this image.</p>
          {onRetry && <Button size="sm" variant="outline" onClick={onRetry}><RotateCcw />Try again</Button>}
        </div>
      )}

      {status === "done" && src && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          {onExpand && <Tooltip label="Expand"><Button size="icon-xs" variant="outline" onClick={onExpand} aria-label="Expand image"><Expand /></Button></Tooltip>}
          <Tooltip label="Download"><Button size="icon-xs" variant="outline" onClick={download} aria-label="Download image"><Download /></Button></Tooltip>
        </div>
      )}
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
}
