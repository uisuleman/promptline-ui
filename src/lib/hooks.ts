import * as React from "react";

/** Copy text to clipboard, `copied` is true for `timeout` ms. */
export function useCopy(timeout = 2000) {
  const [copied, setCopied] = React.useState(false);
  const t = React.useRef<number | undefined>(undefined);
  const copy = React.useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* blocked */ }
    setCopied(true);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setCopied(false), timeout);
  }, [timeout]);
  return { copied, copy };
}

/** Close on outside click / Escape. */
export function useDismiss(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open, onClose, ref]);
}

/** Controlled-or-uncontrolled state helper. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : inner;
  const set = React.useCallback((v: T) => { if (!isControlled) setInner(v); onChange?.(v); }, [isControlled, onChange]);
  return [current, set] as const;
}
