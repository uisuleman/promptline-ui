import crypto from "crypto";
import fs from "fs"; import { execSync } from "child_process"; import * as esbuild from "esbuild"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
execSync("node scripts/gen-index.mjs && node scripts/gen-meta.mjs", { stdio: "inherit" });
const env = process.env;
const BASE = (env.SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + env.VERCEL_PROJECT_PRODUCTION_URL : "https://promptline-ui.vercel.app")).replace(/\/$/, "");
const GITHUB_URL = env.GITHUB_URL || (env.VERCEL_GIT_REPO_OWNER && env.VERCEL_GIT_REPO_SLUG ? `https://github.com/${env.VERCEL_GIT_REPO_OWNER}/${env.VERCEL_GIT_REPO_SLUG}` : "");
const FAVICON = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0a0a0a"/><path fill="#fff" d="M16 6l2.4 6.6L25 15l-6.6 2.4L16 24l-2.4-6.6L7 15l6.6-2.4z"/></svg>')}`;
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist/r", { recursive: true });

/* ---------- docs site ---------- */
const hash = (s) => crypto.createHash("md5").update(s).digest("hex").slice(0, 10);
const define = { "process.env.NODE_ENV": '"production"', __GITHUB_URL__: JSON.stringify(GITHUB_URL) };
fs.mkdirSync("dist/assets", { recursive: true });
fs.writeFileSync("dist/in.css", fs.readFileSync("src/styles/tokens.css", "utf8") + "\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\nhtml{scroll-behavior:smooth}body{background:rgb(var(--bg))}\n.pl-preview{background-image:radial-gradient(rgb(var(--fg)/.07) 1px,transparent 1px);background-size:16px 16px}\n");
execSync("npx tailwindcss -i dist/in.css -o dist/app.css --minify 2>/dev/null");
const css = fs.readFileSync("dist/app.css", "utf8");
const bundle = async (hashRouter) => {
  const r = await esbuild.build({ entryPoints: ["docs/main.tsx"], bundle: true, minify: true, write: false, define: { ...define, __HASH_ROUTER__: String(hashRouter) }, jsx: "automatic", logLevel: "warning" });
  return r.outputFiles[0].text;
};
const js = await bundle(false);
const cssFile = `/assets/app-${hash(css)}.css`, jsFile = `/assets/app-${hash(js)}.js`;
fs.writeFileSync("dist" + cssFile, css);
fs.writeFileSync("dist" + jsFile, js);

// Server-render every route to static HTML (real URLs, full content for search engines)
await esbuild.build({ entryPoints: ["docs/ssr.tsx"], bundle: true, platform: "node", format: "cjs", outfile: "dist/.ssr.cjs", define: { ...define, __HASH_ROUTER__: "false" }, jsx: "automatic", logLevel: "error" });
const ssr = require("../dist/.ssr.cjs");
fs.rmSync("dist/.ssr.cjs");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const SITE_DESC = "Free, open-source React + Tailwind components for AI products: chat, agents, usage limits and everything around them.";
const head = ({ title, description, path }) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${BASE}${path === "/" ? "/" : path}">
<link rel="icon" href="${FAVICON}"><meta name="theme-color" content="#0a0a0a">
<meta property="og:type" content="website"><meta property="og:site_name" content="Promptline UI"><meta property="og:url" content="${BASE}${path}"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${BASE}/og.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script>try{if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark')}catch(e){}</script>`;

const docLead = (html) => { const m = /<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/.exec(html); return m ? m[1].replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim() : ""; };
const routes = [
  { path: "/", title: "Promptline UI — The UI layer for AI products", description: SITE_DESC },
  { path: "/components", title: "Components · Promptline UI", description: `${ssr.registry.length} free React + Tailwind components for AI products — chat, agents, product states and UI basics, each with design notes.` },
  ...ssr.registry.map((e) => ({ path: `/components/${e.slug}`, title: `${e.name} — ${e.section === "ui" ? "React UI component" : "AI UI component"} · Promptline UI`, description: e.description })),
  ...ssr.docPages.map((p) => ({ path: `/docs/${p.id}`, title: `${p.title} · Promptline UI`, description: null })),
  { path: "/privacy", title: "Privacy Policy · Promptline UI", description: "How the Promptline UI website handles data: no accounts, no tracking." },
  { path: "/terms", title: "Terms of Service · Promptline UI", description: "Terms for using the Promptline UI website and MIT-licensed components." },
];
for (const r of routes) {
  const body = ssr.render(r.path);
  const description = r.description ?? (docLead(body) || SITE_DESC);
  const html = `${head({ ...r, description })}
<link rel="stylesheet" href="${cssFile}"></head><body><div id="root">${body}</div><script src="${jsFile}" defer></script></body></html>`;
  const file = r.path === "/" ? "dist/index.html" : `dist${r.path}.html`;
  fs.mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  fs.writeFileSync(file, html);
}
fs.writeFileSync("dist/404.html", `${head({ title: "Page not found · Promptline UI", description: SITE_DESC, path: "/404" }).replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex">')}
<link rel="stylesheet" href="${cssFile}"></head><body><div id="root">${ssr.render("/404")}</div><script src="${jsFile}" defer></script></body></html>`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${BASE}${r.path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);

// Single-file build (hash routes, everything inline) for offline previews
fs.mkdirSync("build", { recursive: true });
const jsInline = (await bundle(true)).replace(/<\/script/gi, "<\\/script");
fs.writeFileSync("build/preview.html", `${head(routes[0])}
<style>${css}</style></head><body><div id="root"></div><script>${jsInline}</script></body></html>`);
["in.css", "app.css"].forEach((f) => fs.rmSync("dist/" + f));
console.log("pages:", routes.length);

/* ---------- registry + llms.txt ---------- */
await esbuild.build({ entryPoints: ["docs/registry.ts"], bundle: true, format: "cjs", platform: "node", outfile: "dist/.registry.cjs", logLevel: "warning" });
const { registry } = require("../dist/.registry.cjs");
fs.rmSync("dist/.registry.cjs");
const meta = JSON.parse(fs.readFileSync("docs/generated/meta.json", "utf8"));

const src = (p) => meta.shared[p] ?? meta.files[p]?.source;
const typeOf = (p) => (p.startsWith("lib/") ? "registry:lib" : p.startsWith("components/ui/") ? "registry:ui" : "registry:component");

const theme = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json", name: "theme", type: "registry:style", title: "Promptline theme",
  description: "Design tokens and Tailwind preset. Import styles/promptline-tokens.css globally and add the preset to tailwind.config.",
  dependencies: ["clsx", "tailwind-merge"],
  docs: "Promptline theme installed. Two one-time steps:\n1) Create tailwind.config.js with: module.exports = { presets: [require(\"./tailwind.preset.js\")] }  (Tailwind v3: add the preset to your existing config instead)\n2) In your global CSS, after @import \"tailwindcss\": add @import \"../styles/promptline-tokens.css\"; and, for Tailwind v4, @config \"../tailwind.config.js\"; (adjust paths to your CSS file's location)",
  files: [
    { path: "styles/tokens.css", type: "registry:file", target: "styles/promptline-tokens.css", content: src("styles/tokens.css") },
    { path: "tailwind.preset.js", type: "registry:file", target: "~/tailwind.preset.js", content: src("tailwind.preset.js") },
    { path: "lib/cn.ts", type: "registry:lib", target: "lib/cn.ts", content: src("lib/cn.ts") },
  ],
};
fs.writeFileSync("dist/r/theme.json", JSON.stringify(theme, null, 2));
const index = [{ name: "theme", type: theme.type, title: theme.title, description: theme.description }];
for (const e of registry) {
  const f = meta.files[e.file];
  const paths = [...f.files.filter((p) => p !== "lib/cn.ts"), e.file];
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: e.slug, type: typeOf(e.file), title: e.name, description: e.description,
    dependencies: [...new Set(["lucide-react", ...f.npm])].filter((d) => !["react-dom", "clsx", "tailwind-merge"].includes(d)),
    registryDependencies: [`${BASE}/r/theme.json`],
    docs: `${e.name} added. Design notes:\n${e.notes.map((n) => "• " + n).join("\n")}\nDocs: ${BASE}/components/${e.slug}`,
    files: paths.map((p) => ({ path: p, type: typeOf(p), target: p, content: src(p) })),
    meta: { features: e.features, designNotes: e.notes, docs: `${BASE}/components/${e.slug}` },
  };
  fs.writeFileSync(`dist/r/${e.slug}.json`, JSON.stringify(item, null, 2));
  index.push({ name: e.slug, type: item.type, title: e.name, description: e.description });
}
fs.writeFileSync("dist/r/registry.json", JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "promptline", homepage: BASE, items: index }, null, 2));

const url = (e) => `${BASE}/components/${e.slug}`;
const titles = { ai: "AI components", ui: "UI components" };
const lines = (full) => [
  "# Promptline UI",
  "",
  "> Free, open-source UI components for AI products — chat, agents, product states and everything around them. React + Tailwind, neutral by default, with design notes explaining every decision.",
  "",
  `Install any item: npx shadcn@latest add ${BASE}/r/<name>.json`,
  "",
  ...Object.entries(titles).flatMap(([id, t]) => [`## ${t}`, "", ...registry.filter((e) => e.section === id).flatMap((e) => full
    ? [`### ${e.name}`, "", e.description, "", `Docs: ${url(e)}`, `Registry: ${BASE}/r/${e.slug}.json`, "", "Features:", ...e.features.map((x) => `- ${x}`), "", "Design notes:", ...e.notes.map((x) => `- ${x}`), ""]
    : [`- [${e.name}](${url(e)}): ${e.description}`]), ""]),
].join("\n");
fs.writeFileSync("dist/llms.txt", lines(false));
fs.writeFileSync("dist/llms-full.txt", lines(true));
console.log("built", Math.round(fs.statSync("dist/index.html").size / 1024) + "KB", "·", registry.length, "registry items");

if (fs.existsSync("public")) fs.cpSync("public", "dist", { recursive: true });
console.log("site:", BASE, GITHUB_URL ? "· github: " + GITHUB_URL : "");
