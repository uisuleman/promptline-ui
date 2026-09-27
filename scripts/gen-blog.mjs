// Reads content/blog/*.md → docs/generated/blog.json (meta, reading time, TOC and render segments).
// Custom syntax inside posts:
//   :::demo prompt-input/Default      → a live component demo with Preview / Code tabs
//   ```tsx title="app/page.tsx"       → a code block with a filename
import fs from "fs"; import path from "path";
import { Marked } from "marked";
import YAML from "yaml";

const dir = "content/blog";
const config = JSON.parse(fs.readFileSync(path.join(dir, "config.json"), "utf8"));
const BRAND = JSON.parse(fs.readFileSync("brand.json", "utf8"));
// {{brand.name}}, {{brand.short}}, {{brand.slug}}, {{brand.url}} → values from brand.json, so a rename updates every post
const fill = (s) => s.replace(/\{\{brand\.(\w+)\}\}/g, (_, k) => BRAND[k] ?? "");
// Read width/height of PNG/WebP/JPEG images in /public so article images reserve space (no layout shift)
function imageSize(src) {
  try {
    const b = fs.readFileSync(path.join("public", src));
    if (b.toString("ascii", 1, 4) === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b.toString("ascii", 8, 12) === "WEBP") {
      const kind = b.toString("ascii", 12, 16);
      if (kind === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      if (kind === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      if (kind === "VP8L") { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
    }
    if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; } }
  } catch {}
  return null;
}
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function render(md) {
  const headings = [];
  const used = new Set();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugify(text); while (used.has(id)) id += "-2"; used.add(id);
        if (depth === 2 || depth === 3) headings.push({ id, text: text.replace(/<[^>]+>/g, ""), depth });
        const toc = depth === 2 ? ' data-toc' : depth === 3 ? ' data-toc="sub"' : "";
        return `<h${depth} id="${id}"${toc}><a href="#${id}" class="pl-anchor">${text}</a></h${depth}>`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const ext = /^https?:\/\//.test(href);
        return `<a href="${href}"${title ? ` title="${title}"` : ""}${ext ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
      },
      image({ href, title, text }) {
        const size = href.startsWith("/") ? imageSize(href) : null;
        const dims = size ? ` width="${size[0]}" height="${size[1]}"` : "";
        return `<figure><img src="${href}" alt="${text}"${dims} loading="lazy" decoding="async">${title ? `<figcaption>${title}</figcaption>` : ""}</figure>`;
      },
    },
  });
  // Split into html / code / demo segments
  const segments = [];
  const lines = md.split("\n");
  let buf = [];
  const flush = () => { const t = buf.join("\n").trim(); if (t) segments.push({ type: "html", html: marked.parse(t) }); buf = []; };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const demo = /^:::demo\s+([\w-]+)\/(\w+)\s*$/.exec(l);
    if (demo) { flush(); segments.push({ type: "demo", slug: demo[1], name: demo[2] }); continue; }
    const fence = /^```(\w+)?(?:\s+title="([^"]+)")?\s*$/.exec(l);
    if (fence) {
      flush();
      const body = []; i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      segments.push({ type: "code", lang: fence[1] || "text", filename: fence[2], code: body.join("\n") });
      continue;
    }
    buf.push(l);
  }
  flush();
  return { segments, headings };
}

const posts = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
  const raw = fill(fs.readFileSync(path.join(dir, f), "utf8"));
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`${f}: missing frontmatter`);
  const meta = YAML.parse(m[1]);
  const body = m[2];
  for (const k of ["title", "description", "date", "topic"]) if (!meta[k]) throw new Error(`${f}: missing "${k}"`);
  // Unquoted "key: value" inside a list item turns into an object in YAML — catch it here, not at render time
  for (const t of meta.tldr ?? []) if (typeof t !== "string") throw new Error(`${f}: a tldr item isn't plain text — wrap it in quotes: ${JSON.stringify(t)}`);
  for (const q of meta.faq ?? []) if (typeof q?.q !== "string" || typeof q?.a !== "string") throw new Error(`${f}: faq items need string q and a — wrap text containing ": " in quotes`);
  if (!config.topics.some((t) => t.id === meta.topic)) throw new Error(`${f}: unknown topic "${meta.topic}"`);
  const words = body.replace(/```[\s\S]*?```/g, " ").replace(/[#*_>`\-\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  const { segments, headings } = render(body);
  const iso = (d) => (d ? new Date(d).toISOString().slice(0, 10) : undefined);
  return {
    slug: meta.slug ?? f.replace(/\.md$/, ""),
    title: meta.title, seoTitle: meta.seoTitle, description: meta.description,
    date: iso(meta.date), updated: iso(meta.updated), topic: meta.topic, tags: meta.tags ?? [],
    tldr: meta.tldr ?? [], faq: meta.faq ?? [], components: meta.components ?? [],
    draft: !!meta.draft, featured: !!meta.featured,
    coverTitle: meta.coverTitle ?? meta.title, coverMotif: meta.coverMotif ?? ({ tutorials: "code", comparisons: "compare", "ai-ux-patterns": "patterns" }[meta.topic] ?? "chat"),
    cover: fs.existsSync(`public/blog/covers/${meta.slug ?? f.replace(/\.md$/, "")}.webp`) ? { src: `/blog/covers/${meta.slug ?? f.replace(/\.md$/, "")}.webp`, width: 1600, height: 900, alt: meta.coverAlt ?? `Cover image for "${meta.title}"` } : null,
    readingTime: Math.max(1, Math.round(words / 230)), words, headings, segments,
    weight: meta.weight ?? 0,
    mentions: [...new Set([...body.matchAll(/\]\(\/components\/([\w-]+)\)/g)].map((m) => m[1]))],
  };
}).filter((p) => !(config.published && p.draft)).sort((a, b) => (a.date === b.date ? b.weight - a.weight : a.date < b.date ? 1 : -1));

// Internal link check — every /path in a post must resolve to a real page or file
const meta = JSON.parse(fs.readFileSync("docs/generated/meta.json", "utf8"));
const componentSlugs = new Set(Object.keys(meta.demos));
const docIds = new Set([...fs.readFileSync("docs/lib.tsx", "utf8").matchAll(/\{ id: "([\w-]+)", title:/g)].map((m) => m[1]));
const postSlugs = new Set(posts.map((p) => p.slug));
const topicIds = new Set(config.topics.map((t) => t.id));
const problems = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const body = fill(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const [, href] of body.matchAll(/\]\((\/[^)\s#]*)[^)]*\)/g)) {
    const [, a, b, c] = href.split("/");
    const ok =
      href === "/" || href === "/components" || href === "/blog" || href === "/privacy" || href === "/terms" ||
      (a === "components" && componentSlugs.has(b)) || (a === "docs" && docIds.has(b)) ||
      (a === "blog" && b === "topic" && topicIds.has(c)) || (a === "blog" && postSlugs.has(b)) ||
      fs.existsSync(path.join("public", href));
    if (!ok) problems.push(`${f}: broken link ${href}`);
  }
  for (const [, slug, name] of body.matchAll(/^:::demo\s+([\w-]+)\/(\w+)\s*$/gm))
    if (!meta.demos[slug]?.some((d) => d.name === name)) problems.push(`${f}: unknown demo ${slug}/${name}`);
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

fs.mkdirSync("docs/generated", { recursive: true });
fs.writeFileSync("docs/generated/blog.json", JSON.stringify({ config, posts }));
console.log(`blog: ${posts.length} post(s)${config.published ? "" : " · draft mode (noindex)"}`);
