// Generates docs metadata: component sources, dependency graph, props (via the TS compiler API) and demo code.
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const ts = createRequire(import.meta.url)("ts5");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const rel = (p) => path.relative(path.join(root, "src"), p).replaceAll("\\", "/");
const read = (p) => fs.readFileSync(p, "utf8");

/* ---------- props extraction ---------- */
function jsDocOf(node, sf) {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.pos) ?? [];
  const docs = ranges.map((r) => sf.text.slice(r.pos, r.end)).filter((c) => c.startsWith("/**"));
  if (!docs.length) return "";
  return docs.at(-1).replace(/^\/\*\*|\*\/$/g, "").split("\n").map((l) => l.replace(/^\s*\*\s?/, "")).join(" ").trim();
}

function membersOf(typeNode, sf, decls) {
  const out = { props: [], extends: [] };
  const fromMembers = (members) => {
    for (const m of members) {
      if (!ts.isPropertySignature(m) || !m.name) continue;
      out.props.push({ name: m.name.getText(sf), type: m.type ? m.type.getText(sf).replace(/\s+/g, " ") : "unknown", required: !m.questionToken, description: jsDocOf(m, sf) });
    }
  };
  const visit = (t) => {
    if (!t) return;
    if (ts.isTypeLiteralNode(t)) fromMembers(t.members);
    else if (ts.isIntersectionTypeNode(t)) t.types.forEach(visit);
    else if (ts.isTypeReferenceNode(t)) {
      const name = t.typeName.getText(sf);
      const d = decls.get(name);
      if (d && ts.isInterfaceDeclaration(d)) {
        fromMembers(d.members);
        d.heritageClauses?.forEach((h) => h.types.forEach((x) => out.extends.push(x.getText(sf))));
      } else if (d && ts.isTypeAliasDeclaration(d)) visit(d.type);
      else out.extends.push(t.getText(sf));
    }
  };
  visit(typeNode);
  return out;
}

function extractProps(file) {
  const sf = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const decls = new Map();
  const fns = new Map();
  sf.forEachChild((n) => {
    if ((ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name) decls.set(n.name.text, n);
    if (ts.isFunctionDeclaration(n) && n.name) fns.set(n.name.text, n);
    if (ts.isVariableStatement(n)) n.declarationList.declarations.forEach((d) => {
      if (d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) fns.set(d.name.getText(sf), d.initializer);
    });
  });
  const result = {};
  for (const [name, fn] of fns) {
    if (!/^[A-Z]/.test(name)) continue;
    const p = fn.parameters?.[0];
    if (!p) { result[name] = { props: [], extends: [] }; continue; }
    const info = membersOf(p.type, sf, decls);
    const defaults = {};
    if (ts.isObjectBindingPattern(p.name)) p.name.elements.forEach((e) => { if (e.initializer) defaults[(e.propertyName ?? e.name).getText(sf)] = e.initializer.getText(sf); });
    info.props.forEach((pr) => { if (defaults[pr.name]) pr.default = defaults[pr.name]; });
    // drop className/children noise to the end
    info.props.sort((a, b) => (["className", "children"].includes(a.name) ? 1 : 0) - (["className", "children"].includes(b.name) ? 1 : 0) || Number(b.required) - Number(a.required));
    result[name] = info;
  }
  return result;
}

/* ---------- dependency graph ---------- */
function localImports(file) {
  const src = read(file);
  const deps = [], npm = new Set();
  for (const m of src.matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1];
    if (spec.startsWith(".")) {
      let p = path.resolve(path.dirname(file), spec);
      p = [".tsx", ".ts"].map((e) => p + e).find((x) => fs.existsSync(x));
      if (p) deps.push(p);
    } else if (spec !== "react") npm.add(spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/"));
  }
  return { deps, npm: [...npm] };
}
function closure(file) {
  const seen = new Set(), npm = new Set();
  const walk = (f) => {
    if (seen.has(f)) return;
    seen.add(f);
    const { deps, npm: n } = localImports(f);
    n.forEach((x) => npm.add(x));
    deps.forEach(walk);
  };
  walk(file);
  if ([...seen].some((f) => f.endsWith("cn.ts"))) { npm.add("clsx"); npm.add("tailwind-merge"); }
  seen.delete(file);
  return { files: [...seen].map(rel).sort(), npm: [...npm].sort() };
}

/* ---------- demos ---------- */
function demoBlocks(file) {
  const src = read(file);
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const blocks = [];
  let preamble = [];
  sf.forEachChild((n) => {
    if (ts.isFunctionDeclaration(n) && n.name && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      blocks.push({ name: n.name.text, code: [...preamble, n.getText(sf).replace(/^export /, "")].join("\n\n") });
      preamble = [];
    } else if (ts.isVariableStatement(n) || (ts.isFunctionDeclaration(n))) {
      preamble.push(n.getText(sf)); // module-level helpers (e.g. const code = ...) stay with the next demo
    }
  });
  return blocks;
}

/* ---------- write ---------- */
// Files: every component/template source, keyed by path relative to src/
const files = {};
for (const dir of ["components/ai", "components/ui"]) {
  for (const f of fs.readdirSync(path.join(root, "src", dir))) {
    if (!f.endsWith(".tsx") || f === "primitives.tsx") continue;
    const file = path.join(root, "src", dir, f);
    files[`${dir}/${f}`] = { source: read(file), ...closure(file), props: extractProps(file) };
  }
}
// Demos: keyed by page slug (= demo filename)
const demoDir = path.join(root, "docs/demos");
const demos = {};
for (const f of fs.readdirSync(demoDir)) {
  if (!f.endsWith(".tsx") || f.startsWith("_")) continue;
  demos[f.replace(/\.tsx$/, "")] = demoBlocks(path.join(demoDir, f));
}
const shared = {};
for (const p of ["lib/cn.ts", "lib/hooks.ts", "lib/floating.tsx", "styles/tokens.css"]) shared[p] = read(path.join(root, "src", p));
shared["tailwind.preset.js"] = read(path.join(root, "tailwind.preset.js"));

fs.mkdirSync(path.join(root, "docs/generated"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/generated/meta.json"), JSON.stringify({ files, demos, shared }));

// demo module index
const slugs = Object.keys(demos);
const id = (s) => "d_" + s.replace(/-/g, "_");
fs.writeFileSync(
  path.join(root, "docs/generated/demos.ts"),
  slugs.map((s) => `import * as ${id(s)} from "../demos/${s}";`).join("\n") +
    `\n\nexport const demos: Record<string, Record<string, () => import("react").ReactElement>> = {\n${slugs.map((s) => `  "${s}": ${id(s)} as any,`).join("\n")}\n};\n`
);
console.log(`meta: ${Object.keys(files).length} files, ${slugs.length} demo pages`);
