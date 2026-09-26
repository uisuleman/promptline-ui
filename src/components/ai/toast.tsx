import * as React from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Toast
 * Wrap your app once: <Toaster>{app}</Toaster>, then `const toast = useToast(); toast({ title: "Copied" })`.
 * Auto-dismisses (4s), max 3 visible, pauses while hovered, announced to screen readers.
 */
export interface ToastOptions { title: string; description?: string; tone?: "default" | "success" | "error"; action?: { label: string; onClick: () => void }; duration?: number }
interface Item extends ToastOptions { id: number }

const Ctx = React.createContext<(t: ToastOptions) => void>(() => {});
export const useToast = () => React.useContext(Ctx);

export function ToastView({ title, description, tone = "default", action, onClose, className }: ToastOptions & { onClose?: () => void; className?: string }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-border bg-bg p-4 shadow-lg", className)} style={{ animation: "pl-in .2s var(--ease-out)" }}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "success" ? "text-success" : tone === "error" ? "text-danger" : "text-fg-muted")} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
      </div>
      {action && <button type="button" onClick={action.onClick} className="h-6 shrink-0 rounded-xs border border-border px-2 text-xs font-medium text-fg hover:bg-surface-2">{action.label}</button>}
      {onClose && <button type="button" onClick={onClose} aria-label="Dismiss" className="shrink-0 text-fg-subtle hover:text-fg"><X className="size-4" /></button>}
    </div>
  );
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Item[]>([]);
  const timers = React.useRef(new Map<number, number>());
  const remove = React.useCallback((id: number) => { setItems((l) => l.filter((t) => t.id !== id)); window.clearTimeout(timers.current.get(id)); }, []);
  const arm = (id: number, ms: number) => timers.current.set(id, window.setTimeout(() => remove(id), ms));
  const push = React.useCallback((t: ToastOptions) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l.slice(-2), { ...t, id }]);
    arm(id, t.duration ?? 4000);
  }, [remove]);

  return (
    <Ctx.Provider value={push}>
      {children}
      {typeof document !== "undefined" && createPortal(
        <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[calc(100%-32px)] max-w-sm flex-col gap-2">
          {items.map((t) => (
            <div key={t.id} onMouseEnter={() => window.clearTimeout(timers.current.get(t.id))} onMouseLeave={() => arm(t.id, 2000)}>
              <ToastView {...t} onClose={() => remove(t.id)} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </Ctx.Provider>
  );
}
