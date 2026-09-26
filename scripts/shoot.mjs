import { createRequire } from "module";
import fs from "fs";
const require = createRequire("/home/claude/promptline-ui/");
const { chromium } = require("playwright");
const reg = JSON.parse(fs.readFileSync("dist/r/registry.json", "utf8")).items.filter((i) => i.name !== "theme");
const pages = ["docs/introduction", "docs/why", "docs/changelog", "docs/installation", "docs/usage", "docs/ai-tools", "docs/troubleshooting", "docs/colors", "docs/typography", "docs/spacing", "docs/theme", "docs/contributing", "docs/new-components", "docs/philosophy", "components", "privacy", "terms",
  ...reg.map((i) => "components/" + i.name)];
const [,, scheme = "light", width = "1440", only] = process.argv;
const W = Number(width);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: W, height: 900 }, colorScheme: scheme });
const errs = [];
p.on("pageerror", (e) => errs.push(p.url().split("#")[1] + " :: " + e.message));
p.on("console", (m) => { if (m.type() === "error" && !/ERR_|net::|favicon|fonts/.test(m.text())) errs.push(p.url().split("#")[1] + " :: " + m.text()); });
await p.goto("file:///home/claude/promptline/dist/index.html");
await p.waitForTimeout(400);
const overflow = [];
fs.mkdirSync("shots2", { recursive: true });
for (const pg of only ? only.split(",") : pages) {
  await p.evaluate((h) => (location.hash = "#/" + h), pg);
  await p.waitForTimeout(300);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  if (sw > W) overflow.push(`${pg}: ${sw}`);
  if (await p.evaluate(() => document.querySelector("main")?.innerText.includes("Demo error"))) errs.push(pg + " :: demo error shown");
  await p.screenshot({ path: `shots2/${scheme}-${W}-${pg.replace("/", "_")}.png` });
}
console.log(pages.length, "pages · errors:", errs.length ? errs : "none");
console.log("overflow:", overflow.length ? overflow : "none");
await b.close();
