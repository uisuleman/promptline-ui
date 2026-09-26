// Generates text-only blog cover images (title + topic, no logo or illustration) from docs/generated/blog.json:
//   public/blog/covers/<slug>.webp  1600×900  (shown on the site)
//   public/og/blog/<slug>.png       1200×630  (social share image)
// The title is auto-fitted: long titles shrink, short titles grow, never overflowing.
// Needs Playwright:  npm i -D playwright && npx playwright install chromium
// Usage: node scripts/gen-blog.mjs && node scripts/covers.mjs [slug]
import fs from "fs";
const { chromium } = await import("playwright");
const blog = JSON.parse(fs.readFileSync("docs/generated/blog.json", "utf8"));
const only = process.argv[2];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function page({ w, h, post, topic }) {
  const pad = Math.round(w * 0.06);
  return `<html><head><style>*{box-sizing:border-box}body{margin:0}</style></head><body style="width:${w}px;height:${h}px;background:#0a0a0a;color:#fafafa;font-family:Inter,Geist,system-ui,sans-serif;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:${Math.round(w / 24)}px ${Math.round(w / 24)}px;-webkit-mask-image:radial-gradient(ellipse 80% 90% at 85% 10%,#000 10%,transparent 72%)"></div>
  <div style="position:absolute;right:-10%;top:-30%;width:70%;height:90%;background:radial-gradient(closest-side,rgba(255,255,255,.10),transparent);filter:blur(20px)"></div>
  <div id="box" style="position:absolute;left:${pad}px;top:${Math.round(h * 0.16)}px;width:${Math.round(w * 0.78)}px;height:${Math.round(h * 0.6)}px;display:flex;align-items:center">
    <div id="title" style="font-weight:700;letter-spacing:-0.03em;line-height:1.06;text-wrap:balance">${esc(post.coverTitle).replace(/-/g, "‑")}</div>
  </div>
  <div style="position:absolute;left:${pad}px;bottom:${pad}px;display:flex;align-items:center;gap:14px;font-size:${Math.round(w * 0.016)}px;color:#a3a3a3">
    <span style="padding:6px 14px;border:1px solid #333;border-radius:999px;color:#e5e5e5">${esc(topic)}</span>${post.readingTime} min read</div>
  <script>
    // Fit the title: largest size (max ~8.5% of width) that fits the box
    const t = document.getElementById("title"), box = document.getElementById("box");
    let lo = 20, hi = ${Math.round(w * 0.085)};
    while (hi - lo > 1) { const m = (lo + hi) >> 1; t.style.fontSize = m + "px"; (t.scrollHeight <= box.clientHeight && t.scrollWidth <= box.clientWidth) ? lo = m : hi = m; }
    t.style.fontSize = lo + "px";
  </script></body></html>`;
}

fs.mkdirSync("public/blog/covers", { recursive: true });
fs.mkdirSync("public/og/blog", { recursive: true });
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const post of blog.posts) {
  if (only && post.slug !== only) continue;
  const topic = blog.config.topics.find((t) => t.id === post.topic)?.name ?? "";
  for (const [w, h, out, type] of [[1600, 900, `public/blog/covers/${post.slug}.webp`, "webp"], [1200, 630, `public/og/blog/${post.slug}.png`, "png"]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(page({ w, h, post, topic }));
    await p.waitForTimeout(50);
    const buf = await p.screenshot({ type: "png" });
    if (type === "png") fs.writeFileSync(out, buf);
    else fs.writeFileSync(out.replace(/\.webp$/, ".png.tmp"), buf);
    await p.close();
  }
  console.log("cover:", post.slug);
}
await b.close();
// Convert the site covers to WebP (smaller, better for LCP)
const tmp = fs.readdirSync("public/blog/covers").filter((f) => f.endsWith(".png.tmp"));
if (tmp.length) {
  const { execSync } = await import("child_process");
  for (const f of tmp) {
    const src = `public/blog/covers/${f}`, dst = src.replace(/\.png\.tmp$/, ".webp");
    try { execSync(`python3 -c "from PIL import Image; Image.open('${src}').convert('RGB').save('${dst}','WEBP',quality=82,method=6)"`); }
    catch { execSync(`npx --yes sharp-cli -i ${src} -o ${dst} -f webp -q 82`); }
    fs.rmSync(src);
  }
}
