// Generates blog cover images from docs/generated/blog.json:
//   public/blog/covers/<slug>.webp  1600×900  (shown on the site)
//   public/og/blog/<slug>.png       1200×630  (social share image)
// The title is auto-fitted: long titles shrink, short titles grow, never overflowing.
// Needs Playwright:  npm i -D playwright && npx playwright install chromium
// Usage: node scripts/gen-blog.mjs && node scripts/covers.mjs [slug]
import fs from "fs";
const { chromium } = await import("playwright");
const blog = JSON.parse(fs.readFileSync("docs/generated/blog.json", "utf8"));
const brand = JSON.parse(fs.readFileSync("brand.json", "utf8"));
const only = process.argv[2];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const logo = (size, bg = "#fff", fg = "#0a0a0a") => `<svg width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${bg}"/><path fill="${fg}" d="M16 6l2.4 6.6L25 15l-6.6 2.4L16 24l-2.4-6.6L7 15l6.6-2.4z"/></svg>`;

/* Right-hand illustrations — simple UI motifs drawn with HTML */
const card = "background:#141414;border:1px solid #262626;border-radius:18px;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)";
const line = (w, o = 0.18) => `<div style="height:12px;width:${w}%;border-radius:6px;background:rgba(255,255,255,${o})"></div>`;
const motifs = {
  chat: `<div style="${card};padding:28px;display:flex;flex-direction:column;gap:22px;height:100%">
    <div style="align-self:flex-end;background:#262626;border-radius:14px;padding:14px 18px;font-size:20px;color:#e5e5e5">Plan my launch week</div>
    <div style="display:flex;gap:14px"><div style="flex:none;width:34px;height:34px;border-radius:50%;border:1px solid #333;display:grid;place-items:center">${logo(18, "#141414", "#fff")}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:12px;padding-top:6px">${line(92, 0.5)}${line(78, 0.35)}${line(64, 0.35)}<div style="display:flex;align-items:center;gap:8px">${line(40, 0.35)}<span style="width:10px;height:20px;background:#fafafa;border-radius:2px"></span></div></div></div>
    <div style="margin-top:auto;border:1px solid #333;border-radius:16px;padding:16px 16px 16px 20px;display:flex;align-items:center;gap:12px;font-size:19px;color:#737373">Ask anything…<span style="margin-left:auto;width:36px;height:36px;border-radius:50%;background:#fafafa;display:grid;place-items:center;color:#0a0a0a;font-size:20px">↑</span></div></div>`,
  code: `<div style="${card};height:100%;overflow:hidden;font-family:ui-monospace,Menlo,monospace;font-size:19px;line-height:1.75">
    <div style="display:flex;gap:8px;padding:16px 20px;border-bottom:1px solid #262626"><span style="width:12px;height:12px;border-radius:50%;background:#404040"></span><span style="width:12px;height:12px;border-radius:50%;background:#404040"></span><span style="width:12px;height:12px;border-radius:50%;background:#404040"></span><span style="margin-left:12px;color:#737373;font-size:15px">app/chat.tsx</span></div>
    <div style="padding:20px 24px;color:#d4d4d4"><span style="color:#ff6ea4">import</span> { PromptInput }<br><span style="color:#ff6ea4">from</span> <span style="color:#62d68c">"@/components/ai"</span>;<br><br><span style="color:#ff6ea4">export function</span> <span style="color:#be96ff">Chat</span>() {<br>&nbsp;&nbsp;<span style="color:#ff6ea4">return</span> &lt;<span style="color:#be96ff">PromptInput</span><br>&nbsp;&nbsp;&nbsp;&nbsp;status=<span style="color:#62d68c">"streaming"</span> /&gt;;<br>}</div></div>`,
  compare: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;height:100%">${[0, 1].map((i) => `<div style="${card};padding:24px;display:flex;flex-direction:column;gap:14px;${i ? "border-color:#fafafa" : ""}"><div style="font-size:18px;color:${i ? "#fafafa" : "#737373"};font-weight:600">${i ? "B" : "A"}</div>${line(90)}${line(70)}${line(80)}${line(55)}<div style="margin-top:auto;font-size:28px;color:${i ? "#fafafa" : "#404040"}">${i ? "✓" : "—"}</div></div>`).join("")}</div>`,
  patterns: `<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:18px;height:100%">
    <div style="${card};padding:22px;display:flex;flex-direction:column;gap:12px"><div style="font-size:16px;color:#a3a3a3">Thinking…</div>${line(80, 0.3)}${line(60, 0.2)}</div>
    <div style="${card};padding:22px;display:flex;flex-direction:column;gap:12px;border-color:#b45309"><div style="font-size:16px;color:#fbbf24">Approve action?</div>${line(70, 0.25)}<div style="margin-top:auto;display:flex;gap:8px;justify-content:flex-end"><span style="padding:6px 12px;border:1px solid #333;border-radius:8px;font-size:14px;color:#a3a3a3">Deny</span><span style="padding:6px 12px;background:#fafafa;border-radius:8px;font-size:14px;color:#0a0a0a">Approve</span></div></div>
    <div style="${card};padding:22px;display:flex;flex-direction:column;gap:12px"><div style="font-size:16px;color:#a3a3a3">Sources</div>${line(85, 0.25)}${line(65, 0.25)}${line(75, 0.25)}</div>
    <div style="${card};padding:22px;display:flex;flex-direction:column;gap:14px"><div style="font-size:16px;color:#a3a3a3">46 / 50 messages</div><div style="height:10px;border-radius:5px;background:#262626"><div style="height:100%;width:92%;border-radius:5px;background:#f59e0b"></div></div></div></div>`,
};

function page({ w, h, post, topic }) {
  const pad = Math.round(w * 0.06);
  return `<html><head><style>*{box-sizing:border-box}body{margin:0}</style></head><body style="width:${w}px;height:${h}px;background:#0a0a0a;color:#fafafa;font-family:Inter,Geist,system-ui,sans-serif;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:${Math.round(w / 24)}px ${Math.round(w / 24)}px;-webkit-mask-image:radial-gradient(ellipse 80% 90% at 85% 10%,#000 10%,transparent 72%)"></div>
  <div style="position:absolute;right:-10%;top:-30%;width:70%;height:90%;background:radial-gradient(closest-side,rgba(255,255,255,.10),transparent);filter:blur(20px)"></div>
  <div style="position:absolute;left:${pad}px;top:${pad}px;display:flex;align-items:center;gap:${Math.round(w * 0.01)}px;font-size:${Math.round(w * 0.019)}px;font-weight:600">${logo(Math.round(w * 0.028))}${esc(brand.name)}</div>
  <div id="box" style="position:absolute;left:${pad}px;top:${Math.round(h * 0.25)}px;width:${Math.round(w * 0.46)}px;height:${Math.round(h * 0.5)}px;display:flex;align-items:center">
    <div id="title" style="font-weight:700;letter-spacing:-0.03em;line-height:1.06;text-wrap:balance">${esc(post.coverTitle).replace(/-/g, "‑")}</div>
  </div>
  <div style="position:absolute;left:${pad}px;bottom:${pad}px;display:flex;align-items:center;gap:14px;font-size:${Math.round(w * 0.016)}px;color:#a3a3a3">
    <span style="padding:6px 14px;border:1px solid #333;border-radius:999px;color:#e5e5e5">${esc(topic)}</span>${post.readingTime} min read</div>
  <div style="position:absolute;right:${pad}px;top:${Math.round(h * 0.22)}px;width:${Math.round(w * 0.36)}px;height:${Math.round(h * 0.56)}px">${motifs[post.coverMotif] ?? motifs.chat}</div>
  <script>
    // Fit the title: largest size (max ~7.5% of width) that fits the box
    const t = document.getElementById("title"), box = document.getElementById("box");
    let lo = 20, hi = ${Math.round(w * 0.066)};
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
