import type { BlogCategoryId, BlogPost } from "@/types/blog";
import { BLOG_CATEGORY_BY_NAME } from "@/lib/blog-categories";

const RSS_BASE = "https://zebpay.com/in";
const REVALIDATE = Number(process.env.BLOG_REVALIDATE_SECONDS ?? 3600);

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&#8230;/g, "…");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractTag(block: string, tag: string): string {
  const escaped = tag.replace(":", "\\:");
  const cdata = new RegExp(`<${escaped}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${escaped}>`, "i");
  const plain = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`, "i");
  const match = block.match(cdata) ?? block.match(plain);
  return match ? decodeEntities(match[1].trim()) : "";
}

function extractAllTags(block: string, tag: string): string[] {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(
    `<${escaped}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${escaped}>`,
    "gi"
  );
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(block)) !== null) {
    const value = (match[1] ?? match[2] ?? "").trim();
    if (value) values.push(decodeEntities(value));
  }
  return values;
}

function slugFromLink(link: string): string {
  const url = new URL(link);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function normalizeImageUrl(url: string): string {
  let normalized = url;
  if (normalized.startsWith("/")) normalized = `${RSS_BASE}${normalized}`;
  if (normalized.startsWith("https://zebpay.com/wp-content/")) {
    normalized = normalized.replace("https://zebpay.com/", "https://zebpay.com/in/");
  }
  // WordPress RSS often points at resized variants that 404 — prefer the original asset.
  normalized = normalized.replace(/-(\d+x\d+)(\.(?:jpe?g|png|webp|gif))$/i, "$2");
  return normalized;
}

function extractImageFromTag(tag: string): string | undefined {
  const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);
  if (srcsetMatch) {
    const candidates = srcsetMatch[1]
      .split(",")
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean);
    if (candidates.length > 0) return candidates[candidates.length - 1];
  }

  const srcMatch = tag.match(/src=["']([^"']+)["']/i);
  return srcMatch?.[1];
}

const SKIP_IMAGE_HOSTS = ["googleusercontent.com", "gravatar.com"];

function shouldSkipImage(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return SKIP_IMAGE_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`));
  } catch {
    return true;
  }
}

function isZebPayImage(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "zebpay.com" || host.endsWith(".zebpay.com");
  } catch {
    return false;
  }
}

function extractFeaturedImage(html: string): { url: string; alt?: string } | undefined {
  const imgTags = html.match(/<img[^>]+>/gi) ?? [];
  const candidates: { url: string; alt?: string; preferred: boolean }[] = [];

  for (const tag of imgTags) {
    const rawSrc = extractImageFromTag(tag);
    if (!rawSrc) continue;

    const url = normalizeImageUrl(rawSrc);
    if (shouldSkipImage(url)) continue;

    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    candidates.push({
      url,
      alt: altMatch?.[1],
      preferred: isZebPayImage(url)
    });
  }

  const picked = candidates.find((c) => c.preferred) ?? candidates[0];
  if (!picked) return undefined;

  return { url: picked.url, alt: picked.alt };
}

function resolveCategory(categories: string[], fallback?: BlogCategoryId): BlogCategoryId {
  for (const name of categories) {
    const mapped = BLOG_CATEGORY_BY_NAME.get(name);
    if (mapped) return mapped;
  }
  return fallback ?? "others";
}

function parseRssItem(itemXml: string, fallbackCategory?: BlogCategoryId): BlogPost | null {
  const title = stripHtml(extractTag(itemXml, "title"));
  const link = extractTag(itemXml, "link");
  const slug = slugFromLink(link);
  if (!title || !slug) return null;

  const rawContent = extractTag(itemXml, "content:encoded") || extractTag(itemXml, "description");
  const excerpt = stripHtml(extractTag(itemXml, "description")).slice(0, 280);
  const date = extractTag(itemXml, "pubDate");
  const categories = extractAllTags(itemXml, "category");
  const category = resolveCategory(categories, fallbackCategory);
  const tags = categories.filter((c) => !BLOG_CATEGORY_BY_NAME.has(c)).slice(0, 4);
  const image = extractFeaturedImage(rawContent);

  return {
    slug,
    title,
    excerpt,
    content: rawContent,
    date,
    category,
    tags,
    image
  };
}

export function parseRssFeed(xml: string, fallbackCategory?: BlogCategoryId): BlogPost[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items
    .map((item) => parseRssItem(item, fallbackCategory))
    .filter((post): post is BlogPost => post !== null);
}

export async function fetchRssFeed(path: string, fallbackCategory?: BlogCategoryId): Promise<BlogPost[]> {
  const url = path.startsWith("http") ? path : `${RSS_BASE}${path}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssFeed(xml, fallbackCategory);
  } catch {
    return [];
  }
}

const GENERIC_COVER_RE = /zabpay\.png|\/logo[\W_]|favicon|opengraph-image/i;

function isGenericCover(url: string): boolean {
  return GENERIC_COVER_RE.test(url);
}

/** Fetch the WordPress featured image from a post's og:image meta tag. */
export async function fetchPostCoverImage(
  slug: string
): Promise<{ url: string; alt?: string } | undefined> {
  try {
    const res = await fetch(`${RSS_BASE}/blog/${slug}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return undefined;

    const html = await res.text();
    const imageMatch =
      html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ??
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
    if (!imageMatch) return undefined;

    const url = normalizeImageUrl(imageMatch[1]);
    if (isGenericCover(url)) return undefined;

    const altMatch = html.match(/property=["']og:image:alt["']\s+content=["']([^"']+)["']/i);
    return { url, alt: altMatch?.[1] };
  } catch {
    return undefined;
  }
}
