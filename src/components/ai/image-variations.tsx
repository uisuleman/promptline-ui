import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Download, Maximize2, Shuffle, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

/**
 * ImageVariations
 * A 2×2 grid of generated options. Pick one, open it full screen (← → to browse, Esc to close),
 * or ask for variations of a favourite. Selection is explicit so the next step knows which image to use.
 */
export interface Variation { id: string; src?: string; alt: string }

export interface ImageVariationsProps {
  images: Variation[];
  selected?: string;
  onSelect?: (id: string) => void;
  onVary?: (id: string) => void;
  loading?: boolean;
  className?: string;
}

export function ImageVariations({ images, selected, onSelect, onVary, loading, className }: ImageVariationsProps) {
  const [view, setView] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (view == null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
      if (e.key === "ArrowRight") setView((v) => ((v ?? 0) + 1) % images.length);
      if (e.key === "ArrowLeft") setView((v) => ((v ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [view, images.length]);

  return (
    <div className={cn("space-y-3", className)}>
      <div role="radiogroup" aria-label="Image options" className="grid grid-cols-2 gap-2">
        {images.map((img, i) => {
          const on = selected === img.id;
          return (
            <div key={img.id} className={cn("group relative aspect-square overflow-hidden rounded-lg bg-surface-2 ring-offset-2 ring-offset-bg transition-shadow", on && "ring-2 ring-fg")}>
              {loading || !img.src ? (
                <div className="absolute inset-0 overflow-hidden"><div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-fg/[0.06] to-transparent" style={{ animation: `pl-shimmer-x 1.6s ${i * 0.15}s infinite` }} /></div>
              ) : (
                <>
                  <button type="button" role="radio" aria-checked={on} aria-label={`Option ${i + 1}: ${img.alt}`} onClick={() => onSelect?.(img.id)} className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fg">
                    <img src={img.src} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  </button>
                  <span className="pointer-events-none absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-bg/90 text-2xs font-semibold text-fg shadow-sm">{on ? <Check className="size-3.5" /> : i + 1}</span>
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                    {onVary && <Button size="icon-xs" variant="outline" aria-label="More like this" onClick={() => onVary(img.id)}><Shuffle /></Button>}
                    <Button size="icon-xs" variant="outline" aria-label="View full size" onClick={() => setView(i)}><Maximize2 /></Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {!loading && <p className="text-xs text-fg-subtle">{selected ? `Option ${images.findIndex((i) => i.id === selected) + 1} selected` : "Pick an option to continue"}</p>}

      {view != null && createPortal(
        <div className="fixed inset-0 z-[150] flex flex-col bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" style={{ animation: "pl-in .15s ease-out" }}>
          <div className="flex items-center justify-between text-sm text-white/80">
            <span className="tabular-nums">{view + 1} / {images.length}</span>
            <div className="flex gap-1">
              {images[view].src && <a href={images[view].src} download="image.png" aria-label="Download" className="grid size-9 place-items-center rounded-md hover:bg-white/10"><Download className="size-4" /></a>}
              <button type="button" onClick={() => setView(null)} aria-label="Close" className="grid size-9 place-items-center rounded-md hover:bg-white/10"><X className="size-4" /></button>
            </div>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <button type="button" onClick={() => setView((view - 1 + images.length) % images.length)} aria-label="Previous" className="absolute left-0 grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/10"><ChevronLeft className="size-5" /></button>
            <img src={images[view].src} alt={images[view].alt} className="max-h-full max-w-full rounded-lg object-contain" />
            <button type="button" onClick={() => setView((view + 1) % images.length)} aria-label="Next" className="absolute right-0 grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/10"><ChevronRight className="size-5" /></button>
          </div>
          <div className="flex justify-center pt-3">
            <Button variant="secondary" onClick={() => { onSelect?.(images[view].id); setView(null); }}><Check />Use this image</Button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
