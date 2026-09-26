import data from "./generated/blog.json";

export type Segment =
  | { type: "html"; html: string }
  | { type: "code"; lang: string; filename?: string; code: string }
  | { type: "demo"; slug: string; name: string };
export interface Post {
  slug: string; title: string; seoTitle?: string; description: string; date: string; updated?: string;
  topic: string; tags: string[]; tldr: string[]; faq: { q: string; a: string }[]; components: string[];
  draft: boolean; featured: boolean; readingTime: number; words: number;
  headings: { id: string; text: string; depth: number }[]; segments: Segment[];
}
export interface Topic { id: string; name: string; description: string }

export const blog = data as unknown as { config: { published: boolean; title: string; heading: string; description: string; topics: Topic[] }; posts: Post[] };
export const posts = blog.posts;
export const topics = blog.config.topics;
export const postBySlug = (s: string) => posts.find((p) => p.slug === s);
export const topicById = (id: string) => topics.find((t) => t.id === id);
export const postHref = (p: { slug: string }) => `/blog/${p.slug}`;
export const topicHref = (t: { id: string }) => `/blog/topic/${t.id}`;
export const formatDate = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export function relatedPosts(p: Post, n = 3) {
  const others = posts.filter((x) => x.slug !== p.slug);
  return [...others.filter((x) => x.topic === p.topic), ...others.filter((x) => x.topic !== p.topic)].slice(0, n);
}
