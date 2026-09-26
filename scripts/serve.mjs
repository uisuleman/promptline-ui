// Local static server that mimics Vercel's cleanUrls: /components/x → components/x.html
import http from "http"; import fs from "fs"; import path from "path";
const root = path.resolve(process.argv[2] || "dist"), port = Number(process.argv[3] || 4321);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".png": "image/png" };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/+$/, "") || "/";
  if (p === "/docs") { res.writeHead(307, { Location: "/docs/introduction" }); return res.end(); }
  const tries = p === "/" ? ["index.html"] : [p, p + ".html"];
  for (const t of tries) { const f = path.join(root, t); if (fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { "Content-Type": types[path.extname(f)] ?? "application/octet-stream" }); return fs.createReadStream(f).pipe(res); } }
  res.writeHead(404, { "Content-Type": types[".html"] }); fs.createReadStream(path.join(root, "404.html")).pipe(res);
}).listen(port, () => console.log(`http://localhost:${port}`));
