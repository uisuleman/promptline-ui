import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * StreamingText
 * Renders a model's reply as it arrives. Tokens land in bursts; this smooths them into an
 * even reveal that speeds up when it falls behind, so text never stutters or lags far behind.
 * - Lightweight markdown: headings, paragraphs, lists, **bold**, *italic*, `code`, fenced code
 * - Blinking caret while streaming, removed when done
 * - Respects prefers-reduced-motion (shows text immediately)
 * - aria-busy while streaming so screen readers read the finished answer once
 */
export interface StreamingTextProps {
  /** The full text received so far — just keep appending to it */
  text: string;
  isStreaming?: boolean;
  /** Characters per second when caught up (default 90) */
  speed?: number;
  /** Render markdown (default true) */
  markdown?: boolean;
  showCaret?: boolean;
  onRevealed?: () => void;
  className?: string;
}

export function useSmoothText(text: string, speed = 90) {
  const [n, setN] = React.useState(text.length);
  const target = React.useRef(text.length);
  const shown = React.useRef(n);
  target.current = text.length;

  React.useEffect(() => {
    if (text.length < shown.current) { shown.current = text.length; setN(text.length); }
  }, [text]);

  React.useEffect(() => {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      const backlog = target.current - shown.current;
      if (backlog > 0) {
        // Base speed, accelerating with backlog so we never trail by more than ~1s
        const rate = reduce ? Infinity : Math.max(speed, backlog * 2.5);
        shown.current = Math.min(target.current, shown.current + Math.max(1, Math.round(rate * dt)));
        setN(shown.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return text.slice(0, n);
}

export function StreamingText({ text, isStreaming = false, speed = 90, markdown = true, showCaret = true, onRevealed, className }: StreamingTextProps) {
  const visible = useSmoothText(text, speed);
  const revealing = visible.length < text.length;
  const caret = showCaret && (isStreaming || revealing);
  const done = !isStreaming && !revealing;
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (done && !fired.current && text) { fired.current = true; onRevealed?.(); }
    if (!done) fired.current = false;
  }, [done, text, onRevealed]);

  return (
    <div aria-busy={!done} aria-live="polite" className={cn("text-md text-fg [overflow-wrap:anywhere]", className)}>
      {markdown ? <Markdown source={visible} caret={caret} /> : <p className="whitespace-pre-wrap">{visible}{caret && <Caret />}</p>}
    </div>
  );
}

function Caret() {
  return <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] rounded-[1px] bg-fg" style={{ animation: "pl-blink 1s steps(1) infinite" }} />;
}

/* ---------- tiny markdown ---------- */
function inline(s: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("`")) out.push(<code key={key + i++} className="rounded-xs bg-surface-2 px-1 py-0.5 font-mono text-[0.9em]">{t.slice(1, -1)}</code>);
    else if (t.startsWith("**")) out.push(<strong key={key + i++} className="font-semibold">{t.slice(2, -2)}</strong>);
    else out.push(<em key={key + i++}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function Markdown({ source, caret }: { source: string; caret?: boolean }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0, k = 0;
  const lastIndex = () => blocks.length;
  let caretAt = -1;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={k++} className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-sm leading-6"><code data-lang={lang || undefined}>{body.join("\n")}</code></pre>);
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) { const T = (["h3", "h4", "h5"] as const)[h[1].length - 1]; blocks.push(<T key={k++} className="font-semibold text-fg">{inline(h[2], "h" + k)}</T>); i++; continue; }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/).test(lines[i])) items.push(lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
      const L = ordered ? "ol" : "ul";
      blocks.push(<L key={k++} className={cn("space-y-1 pl-5", ordered ? "list-decimal" : "list-disc")}>{items.map((t, j) => <li key={j}>{inline(t, `l${k}-${j}`)}</li>)}</L>);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(<p key={k++}>{inline(para.join(" "), "p" + k)}</p>);
  }
  caretAt = lastIndex() - 1;
  return (
    <div className="space-y-3">
      {blocks.map((b, j) => {
        if (j !== caretAt || !caret || !React.isValidElement(b)) return b;
        const el = b as React.ReactElement<{ children?: React.ReactNode }>;
        if (el.type === "p" || typeof el.type === "string" && /^h\d$/.test(el.type)) return React.cloneElement(el, {}, el.props.children, <Caret key="caret" />);
        return <React.Fragment key={j}>{el}<Caret /></React.Fragment>;
      })}
      {blocks.length === 0 && caret && <p><Caret /></p>}
    </div>
  );
}
