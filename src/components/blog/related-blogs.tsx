import Link from "next/link";
import { BlogImage } from "@/components/blog/blog-image";
import { formatBlogDate } from "@/lib/blog";
import { getCategoryById } from "@/lib/blog-categories";
import { ROUTES } from "@/lib/routes";
import type { BlogPost } from "@/types/blog";

export function RelatedBlogs({ posts, currentSlug }: { posts: BlogPost[]; currentSlug: string }) {
  const related = posts.filter((p) => p.slug !== currentSlug);
  if (related.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-base font-bold text-[var(--fg)]">Related articles</h2>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">More from The Z Blog</p>
      <ul className="mt-4 flex flex-col gap-4">
        {related.map((post) => {
          const category = getCategoryById(post.category);
          return (
            <li key={post.slug}>
              <Link
                href={ROUTES.blogPost(post.slug)}
                className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-strong)]">
                  {post.image ? (
                    <BlogImage
                      src={post.image.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[var(--brand-tint)] px-1 text-center text-[10px] font-bold uppercase text-[var(--brand)]">
                      {category.label.slice(0, 8)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--fg-subtle)]">{formatBlogDate(post.date)}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-[var(--fg)] group-hover:text-[var(--brand)]">
                    {post.title}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={ROUTES.blog}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand)] hover:underline"
      >
        View all articles
      </Link>
    </aside>
  );
}
