import * as React from "react";
import { Check, Copy, Download, WrapText } from "lucide-react";
import { cn } from "../../lib/cn";
import { useCopy } from "../../lib/hooks";
import { Tooltip } from "../ui/tooltip";

/**
 * CodeBlock
 * Header (filename or language) · copy · optional download & wrap toggle · line numbers · line highlight.
 * Ships with a tiny zero-dependency highlighter for JS/TS/Python/Bash/JSON.
 * For full grammar support, pass pre-highlighted nodes via `children` (e.g. from Shiki).
 */
export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  /** 1-based line numbers to highlight */
  highlightLines?: number[];
  downloadable?: boolean;
  wrap?: boolean;
  maxHeight?: number;
  children?: React.ReactNode;
  className?: string;
}

const KW = new Set("const let var function return if else for while of in new class extends import from export default async await try catch finally throw typeof interface type enum implements public private readonly def lambda pass None True False self elif with as yield not and or is null undefined true false this echo fi then do done".split(" "));

type Tok = { t: string; c?: "kw" | "str" | "com" | "num" | "fn" };
export function highlight(code: string): Tok[][] {
  const re = /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;
  return code.split("\n").map((line) => {
    const out: Tok[] = [];
    let last = 0;
    for (const m of line.matchAll(re)) {
      if (m.index! > last) out.push({ t: line.slice(last, m.index) });
      if (m[1]) out.push({ t: m[1], c: "com" });
      else if (m[2]) out.push({ t: m[2], c: "str" });
      else if (m[3]) out.push({ t: m[3], c: "num" });
      else if (m[4]) out.push({ t: m[4], c: KW.has(m[4]) ? "kw" : "fn" });
      else out.push({ t: m[5], c: KW.has(m[5]) ? "kw" : undefined });
      last = m.index! + m[0].length;
    }
    if (last < line.length) out.push({ t: line.slice(last) });
    return out;
  });
}

const tokCls = { kw: "text-[rgb(var(--syn-keyword))]", str: "text-[rgb(var(--syn-string))]", com: "text-[rgb(var(--syn-comment))] italic", num: "text-[rgb(var(--syn-number))]", fn: "text-[rgb(var(--syn-fn))]" };

export function CodeBlock({ code, language = "text", filename, showLineNumbers, highlightLines = [], downloadable, wrap: wrapDefault = false, maxHeight, children, className }: CodeBlockProps) {
  const { copied, copy } = useCopy();
  const [wrap, setWrap] = React.useState(wrapDefault);
  const lines = React.useMemo(() => highlight(code), [code]);
  const hl = new Set(highlightLines);
  const btn = "grid size-7 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg";

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename ?? `snippet.${language}` });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      <div className="flex h-10 items-center gap-1 border-b border-border pl-4 pr-2">
        <span className="flex-1 truncate font-mono text-xs text-fg-muted">{filename ?? language}</span>
        <Tooltip label={wrap ? "Don't wrap" : "Wrap lines"}><button type="button" className={cn(btn, wrap && "text-fg")} onClick={() => setWrap((w) => !w)} aria-pressed={wrap} aria-label="Toggle line wrap"><WrapText className="size-3.5" /></button></Tooltip>
        {downloadable && <Tooltip label="Download"><button type="button" className={btn} onClick={download} aria-label="Download file"><Download className="size-3.5" /></button></Tooltip>}
        <Tooltip label={copied ? "Copied" : "Copy"}><button type="button" className={btn} onClick={() => copy(code)} aria-label="Copy code">{copied ? <Check className="size-3.5 text-fg" /> : <Copy className="size-3.5" />}</button></Tooltip>
      </div>
      <pre className={cn("overflow-auto py-4 font-mono text-sm leading-6 text-fg", wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre")} style={{ maxHeight }}>
        {children ?? (
          <code className="block min-w-fit">
            {lines.map((toks, i) => (
              <span key={i} className={cn("flex px-4", hl.has(i + 1) && "bg-info/[0.08] shadow-[inset_2px_0_0_rgb(var(--info))]")}>
                {showLineNumbers && <span aria-hidden className="mr-4 inline-block w-6 shrink-0 select-none text-right text-fg-subtle">{i + 1}</span>}
                <span className="flex-1">
                  {toks.length ? toks.map((tk, j) => <span key={j} className={tk.c && tokCls[tk.c]}>{tk.t}</span>) : "​"}
                </span>
              </span>
            ))}
          </code>
        )}
      </pre>
    </div>
  );
}
