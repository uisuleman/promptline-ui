import fs from "fs";
// Generates public/og/blog/<slug>.png share images. Needs Playwright: npm i -D playwright && npx playwright install chromium
const { chromium } = await import("playwright");
const blog = JSON.parse(fs.readFileSync("docs/generated/blog.json", "utf8"));
const brand = JSON.parse(fs.readFileSync("brand.json", "utf8"));
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const post of blog.posts) {
  const topic = blog.config.topics.find((t) => t.id === post.topic)?.name ?? "";
  await p.setContent(`<html><body style="margin:0;width:1200px;height:630px;background:#0a0a0a;color:#fafafa;font-family:Inter,system-ui,sans-serif;position:relative;overflow:hidden">
<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 70% 80% at 80% 0%,#000 10%,transparent 70%)"></div>
<div style="position:absolute;left:80px;top:72px;display:flex;align-items:center;gap:14px;font-size:28px;font-weight:600">
<svg width="40" height="40" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#fff"/><path fill="#0a0a0a" d="M16 6l2.4 6.6L25 15l-6.6 2.4L16 24l-2.4-6.6L7 15l6.6-2.4z"/></svg>${brand.name}<span style="color:#737373;font-weight:400">&nbsp;/&nbsp;Blog</span></div>
<div style="position:absolute;left:80px;right:80px;top:190px;font-size:62px;font-weight:700;letter-spacing:-2px;line-height:1.08;text-wrap:balance">${post.title.replace(/-/g, "\u2011")}</div>
<div style="position:absolute;left:80px;bottom:72px;font-size:26px;color:#a3a3a3">${topic} · ${post.readingTime} min read</div>
</body></html>`);
  await p.screenshot({ path: `public/og/blog/${post.slug}.png` });
  console.log("og:", post.slug);
}
await b.close();
