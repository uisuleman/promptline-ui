# Promptline UI

Free, open-source UI for AI products: **61 AI components and 40 UI components**.
React + Tailwind, neutral by default, no runtime dependency on this library. Every component ships with design notes explaining why it works the way it does.

## Structure
```
src/
  styles/tokens.css        design tokens (light + dark), slider thumb styles
  lib/                     cn, hooks, floating (portal positioning)
  components/ui/           40 UI components (button → date picker)
  components/ai/           61 AI components (prompt input → voice mode)
tailwind.preset.js         tokens → Tailwind classes + type scale
docs/                      documentation site (registry, demos, pages)
scripts/                   build, metadata, registry + llms.txt generation
```

## Build
```
npm i
npm run build     # → dist/: a static HTML page per route, /r/*.json (shadcn registry), llms.txt, sitemap.xml
npm run preview   # serves dist/ at http://localhost:4321 with clean URLs, like Vercel
```

## Use
- **AI prompt:** each docs page has a "Copy prompt" button for Lovable, Bolt, v0, Cursor or Claude.
- **shadcn CLI / MCP:** users add `"@promptline": "https://<your-site>/r/{name}.json"` to components.json and run
  `npx shadcn@latest add @promptline/prompt-input`.

## Deploy (Vercel)
Import the GitHub repo in Vercel — `vercel.json` handles the rest. The site URL and GitHub link are read from
Vercel's build environment automatically. Elsewhere, set `SITE_URL` (and optionally `GITHUB_URL`) before `npm run build`.
- **Manual:** copy `tokens.css`, `tailwind.preset.js`, `src/lib/*` and the component file plus the files it imports.

## Foundations
Geist / Geist Mono · type scale 11/16 → 30/36 · 4px spacing grid · control heights 28/32/36/40 · radius 4/6/8/12/16.
Rebrand with `--accent` / `--accent-fg`, or use the Theme Builder page.

MIT licensed. Designed by Suleman.

## Renaming the project
The name, short name, registry namespace, default URL and author live in `brand.json`.
Change them there, then also update the header comments in `src/styles/tokens.css` and
`tailwind.preset.js`, regenerate `public/og.png`, and rename the repo / Vercel project.

## Writing a blog post
1. Add `content/blog/<slug>.md` with frontmatter: `title`, `description`, `date`, `topic`
   (optional: `seoTitle`, `coverTitle` (shorter text for the cover), `coverAlt`,
   `tldr`, `faq`, `components`, `draft`). Use `:::demo <component>/<Example>` for live demos.
2. Generate the cover and share image: `node scripts/gen-blog.mjs && node scripts/covers.mjs <slug>`
   (needs Playwright). Covers go to `public/blog/covers/`, share images to `public/og/blog/`.
3. `npm run build` — the post gets its page, structured data, RSS entry and sitemap entry.
