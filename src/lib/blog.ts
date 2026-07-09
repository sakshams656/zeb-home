import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { sanitizeBlogHtml } from "@/lib/blog-sanitize";
import { fetchPostCoverImage, fetchRssFeed } from "@/lib/blog-rss";
import type { BlogCategoryId, BlogPost } from "@/types/blog";

const CATEGORY_FEED = (id: BlogCategoryId) => `/blog/category/${id}/feed`;
const COVER_BATCH_SIZE = 8;

let postsCache: BlogPost[] | null = null;
const coverCache = new Map<string, { url: string; alt?: string } | undefined>();

function dedupePosts(posts: BlogPost[]): BlogPost[] {
  const seen = new Map<string, BlogPost>();
  for (const post of posts) {
    const existing = seen.get(post.slug);
    if (!existing || new Date(post.date) > new Date(existing.date)) {
      seen.set(post.slug, post);
    }
  }
  return [...seen.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function finalizePost(post: BlogPost): BlogPost {
  return {
    ...post,
    content: sanitizeBlogHtml(post.content),
    excerpt: post.excerpt.replace(/\s*Read More.*$/i, "").trim()
  };
}

async function resolvePostCover(post: BlogPost): Promise<BlogPost["image"]> {
  if (coverCache.has(post.slug)) {
    return coverCache.get(post.slug) ?? post.image;
  }

  const cover = await fetchPostCoverImage(post.slug);
  coverCache.set(post.slug, cover);
  return cover ?? post.image;
}

async function enrichPostWithCover(post: BlogPost): Promise<BlogPost> {
  const finalized = finalizePost(post);
  const image = await resolvePostCover(finalized);
  return image ? { ...finalized, image } : finalized;
}

async function enrichPostsWithCovers(posts: BlogPost[]): Promise<BlogPost[]> {
  const enriched: BlogPost[] = [];
  for (let i = 0; i < posts.length; i += COVER_BATCH_SIZE) {
    const batch = posts.slice(i, i + COVER_BATCH_SIZE);
    const results = await Promise.all(batch.map(enrichPostWithCover));
    enriched.push(...results);
  }
  return enriched;
}

/** Fetch and cache all posts from category RSS feeds. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (postsCache) return postsCache;

  const feeds = await Promise.all(
    BLOG_CATEGORIES.map((cat) => fetchRssFeed(CATEGORY_FEED(cat.id), cat.id))
  );

  postsCache = await enrichPostsWithCovers(dedupePosts(feeds.flat()));
  return postsCache;
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  const mainFeed = await fetchRssFeed("/feed");
  if (mainFeed.length > 0) return enrichPostWithCover(mainFeed[0]);
  const all = await getAllBlogPosts();
  return all[0] ?? null;
}

export async function getBlogPostsByCategory(
  categoryId: BlogCategoryId,
  limit = 6
): Promise<BlogPost[]> {
  const feed = await fetchRssFeed(CATEGORY_FEED(categoryId), categoryId);
  const posts = feed.length > 0 ? feed : (await getAllBlogPosts()).filter((p) => p.category === categoryId);
  return enrichPostsWithCovers(posts.slice(0, limit));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllBlogPosts();
  const post = all.find((p) => p.slug === slug);
  if (post) return post;

  for (let page = 1; page <= 3; page++) {
    const feed = await fetchRssFeed(`/feed?paged=${page}`);
    const match = feed.find((p) => p.slug === slug);
    if (match) return enrichPostWithCover(match);
  }

  return null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const all = await getAllBlogPosts();
  return all.map((p) => p.slug);
}

export async function getRelatedBlogPosts(
  slug: string,
  limit = 4
): Promise<BlogPost[]> {
  const all = await getAllBlogPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);

  const sameCategory = all.filter((p) => p.slug !== slug && p.category === current.category);
  const tagOverlap = all
    .filter((p) => p.slug !== slug && p.category !== current.category)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.post);

  const related = [...sameCategory, ...tagOverlap];
  const unique = dedupePosts(related);
  return unique.slice(0, limit);
}

export function formatBlogDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
