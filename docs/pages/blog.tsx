import * as React from "react";
import { ArrowRight, Check, ChevronRight, Clock, Copy, Rss } from "lucide-react";
import { BRAND } from "../brand";
import { blog, posts, topics, topicById, postHref, topicHref, formatDate, relatedPosts, type Post } from "../blog";
import { registry } from "../registry";
import { demos } from "../generated/demos";
import { META, PreviewBlock, Code } from "../lib";
import { REGISTRY_URL } from "../site";
import { cn, useCopy } from "../../src";

/* ───────── shared bits ───────── */
function AuthorAvatar({ className }: { className?: string }) {
  return BRAND.author.image
    ? <img src={BRAND.author.image} alt={BRAND.author.name} width={256} height={256} loading="lazy" decoding="async" className={cn("shrink-0 rounded-full border border-border bg-surface object-cover", className)} />
    : <span className={cn("grid shrink-0 place-items-center rounded-full bg-fg font-semibold text-bg", className)}>{BRAND.author.name[0]}</span>;
}
function TopicPill({ id, className }: { id: string; className?: string }) {
  const t = topicById(id);
  if (!t) return null;
  return <a href={topicHref(t)} className={cn("relative z-10 inline-flex h-6 items-center rounded-full bg-surface-2 px-2.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg", className)}>{t.name}</a>;
}

function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-subtle", className)}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{post.readingTime} min read</span>
    </p>
  );
}

function PostCard({ post, eager }: { post: Post; eager?: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-sm">
      {post.cover && (
        <img src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} loading={eager ? "eager" : "lazy"} decoding="async"
          className="aspect-video w-full border-b border-border bg-surface object-cover" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3"><TopicPill id={post.topic} />{post.draft && <span className="text-xs font-medium text-warning">Draft</span>}</div>
        <h2 className="mt-3 text-balance text-lg font-semibold leading-snug tracking-tight text-fg">
          <a href={postHref(post)} className="after:absolute after:inset-0">{post.title}</a>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-fg-muted">{post.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <PostMeta post={post} />
          <ArrowRight className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </article>
  );
}

/* ───────── /blog and /blog/topic/:id ───────── */
export function BlogIndex({ topic }: { topic?: string }) {
  const t = topic ? topicById(topic) : undefined;
  const list = t ? posts.filter((p) => p.topic === t.id) : posts;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        {t ? (
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-sm text-fg-subtle"><a href="/blog" className="hover:text-fg">Blog</a><ChevronRight className="size-3.5" /><span>Topic</span></nav>
        ) : <p className="text-sm font-medium text-fg-subtle">{blog.config.title}</p>}
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl sm:leading-[1.1]">{t ? t.name : blog.config.heading}</h1>
        <p className="mt-4 text-lg text-fg-muted">{t ? t.description : blog.config.description}</p>
      </header>

      <nav aria-label="Topics" className="mt-8 flex flex-wrap items-center gap-2">
        <a href="/blog" aria-current={!t ? "page" : undefined} className={cn("h-8 rounded-full px-3.5 text-sm font-medium leading-8 transition-colors", !t ? "bg-fg text-bg" : "border border-border text-fg-muted hover:text-fg")}>All</a>
        {topics.map((x) => (
          <a key={x.id} href={topicHref(x)} aria-current={t?.id === x.id ? "page" : undefined}
            className={cn("h-8 rounded-full px-3.5 text-sm font-medium leading-8 transition-colors", t?.id === x.id ? "bg-fg text-bg" : "border border-border text-fg-muted hover:text-fg")}>{x.name}</a>
        ))}
        <a href="/blog/rss.xml" className="ml-auto inline-flex h-8 items-center gap-1.5 text-sm text-fg-subtle hover:text-fg"><Rss className="size-3.5" />RSS</a>
      </nav>

      {list.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-border p-10 text-center text-fg-muted">No posts in this topic yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => <PostCard key={p.slug} post={p} eager={i < 3} />)}
        </div>
      )}
    </div>
  );
}

/* ───────── /blog/:slug ───────── */
function InstallLine({ slug }: { slug: string }) {
  const cmd = `npx shadcn@latest add ${REGISTRY_URL}/${slug}.json`;
  const { copied, copy } = useCopy();
  return (
    <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface pl-3 pr-1 font-mono text-xs">
      <span className="min-w-0 flex-1 truncate py-2 text-fg-muted">{cmd}</span>
      <button type="button" onClick={() => copy(cmd)} aria-label="Copy install command" className="grid size-7 shrink-0 place-items-center rounded-sm text-fg-subtle hover:bg-surface-2 hover:text-fg">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}</button>
    </div>
  );
}

export function BlogPost({ post, toc }: { post: Post; toc?: React.ReactNode }) {
  const topic = topicById(post.topic)!;
  const comps = post.components.map((s) => registry.find((r) => r.slug === s)).filter(Boolean) as typeof registry;
  const related = relatedPosts(post);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-16">
        <article className="mx-auto min-w-0 max-w-[46rem] xl:mx-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-fg-subtle">
            <a href="/blog" className="hover:text-fg">Blog</a><ChevronRight className="size-3.5" /><a href={topicHref(topic)} className="hover:text-fg">{topic.name}</a>
          </nav>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl sm:leading-[1.1]">{post.title}</h1>
          <p className="mt-4 text-lg text-fg-muted">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-border pb-6">
            <a href={`https://x.com/${BRAND.author.x}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-fg">
              <AuthorAvatar className="size-8 text-sm" />{BRAND.author.name}
            </a>
            <span className="text-fg-subtle" aria-hidden>·</span>
            <span className="inline-flex items-center gap-1 text-sm text-fg-subtle"><Clock className="size-3.5" />{post.readingTime} min read</span>
            {post.draft && <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Draft</span>}
          </div>

          {post.cover && (
            <figure className="mt-8">
              <img src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} fetchPriority="high" decoding="async"
                className="aspect-video w-full rounded-2xl border border-border bg-surface object-cover" />
            </figure>
          )}

          {post.tldr.length > 0 && (
            <aside aria-label="Summary" className="mt-8 rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-fg">TL;DR</p>
              <ul className="mt-3 space-y-2 text-base text-fg-muted">
                {post.tldr.map((t) => <li key={t} className="flex gap-2.5"><Check className="mt-1 size-4 shrink-0 text-fg" /><span>{t}</span></li>)}
              </ul>
            </aside>
          )}

          <div className="pl-prose mt-10">
            {post.segments.map((s, i) => {
              if (s.type === "html") return <div key={i} dangerouslySetInnerHTML={{ __html: s.html }} />;
              if (s.type === "code") return <div key={i} className="my-6"><Code code={s.code} lang={s.lang} filename={s.filename} /></div>;
              const Demo = demos[s.slug]?.[s.name];
              const code = META.demos[s.slug]?.find((d) => d.name === s.name)?.code ?? "";
              return Demo ? <div key={i} className="not-prose my-8"><PreviewBlock demo={Demo} code={code} minHeight={260} /></div> : null;
            })}
          </div>

          {comps.length > 0 && (
            <section aria-labelledby="components-in-post" className="mt-14 rounded-2xl border border-border p-6">
              <h2 id="components-in-post" className="text-lg font-semibold text-fg">Components in this article</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {comps.map((c) => (
                  <li key={c.slug} className="min-w-0">
                    <a href={`/components/${c.slug}`} className="text-sm font-semibold text-fg underline-offset-4 hover:underline">{c.name}</a>
                    <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{c.description}</p>
                    <InstallLine slug={c.slug} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {post.faq.length > 0 && (
            <section aria-labelledby="faq" className="mt-14">
              <h2 id="faq" data-toc className="scroll-mt-24 text-2xl font-semibold tracking-tight text-fg">FAQ</h2>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {post.faq.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="text-base font-semibold text-fg">{f.q}</dt>
                    <dd className="mt-2 text-base text-fg-muted">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <aside aria-label="About the author" className="mt-14 flex gap-4 rounded-2xl bg-surface p-6">
            <AuthorAvatar className="size-14 text-lg" />
            <div>
              <p className="text-sm text-fg-subtle">Written by</p>
              <p className="text-base font-semibold text-fg">{BRAND.author.name}</p>
              <p className="mt-1 text-sm text-fg-muted">{BRAND.author.bio}</p>
              <a href={`https://x.com/${BRAND.author.x}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-fg underline-offset-4 hover:underline">@{BRAND.author.x} on X</a>
            </div>
          </aside>
        </article>
        <aside className="sticky top-24 hidden h-fit xl:block">{toc}</aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20 border-t border-border pt-12">
          <h2 id="related" className="text-2xl font-semibold tracking-tight text-fg">Similar posts</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </section>
      )}

      <section className="mt-20 flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <p className="text-xl font-semibold tracking-tight text-fg">Build it with {BRAND.name}</p>
          <p className="mt-1 text-fg-muted">{registry.length} free components for AI products — copy, paste, ship.</p>
        </div>
        <a href="/components" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90">Browse components<ArrowRight className="size-4" /></a>
      </section>
    </div>
  );
}
