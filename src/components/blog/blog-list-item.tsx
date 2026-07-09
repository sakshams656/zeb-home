import Link from "next/link";
import { BlogImage } from "@/components/blog/blog-image";
import { ROUTES } from "@/lib/routes";
import type { BlogPost } from "@/types/blog";

export function BlogListItem({ post }: { post: BlogPost }) {
  return (
    <article>
      <Link
        href={ROUTES.blogPost(post.slug)}
        className="group flex gap-3 rounded-xl py-2 transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:gap-4 sm:py-3"
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-strong)] sm:h-[4.5rem] sm:w-28">
          {post.image ? (
            <BlogImage
              src={post.image.url}
              alt={post.image.alt ?? post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--brand-tint)] px-1 text-center text-[10px] font-bold uppercase text-[var(--brand)]">
              Z Blog
            </div>
          )}
        </div>
        <h3 className="min-w-0 flex-1 self-center text-sm font-semibold leading-snug text-[var(--fg)] group-hover:text-[var(--brand)] sm:text-base">
          {post.title}
        </h3>
      </Link>
    </article>
  );
}
