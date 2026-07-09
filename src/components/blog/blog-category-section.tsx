import Link from "next/link";
import { BlogListItem } from "@/components/blog/blog-list-item";
import { Section } from "@/components/ui/section";
import { getCategoryById } from "@/lib/blog-categories";
import { ROUTES } from "@/lib/routes";
import type { BlogCategoryId, BlogPost } from "@/types/blog";

type BlogCategorySectionProps = {
  categoryId: BlogCategoryId;
  posts: BlogPost[];
  showAll?: boolean;
};

export function BlogCategorySection({ categoryId, posts, showAll = false }: BlogCategorySectionProps) {
  const category = getCategoryById(categoryId);
  const visible = showAll ? posts : posts.slice(0, 6);

  if (visible.length === 0) return null;

  return (
    <Section id={categoryId} variant="standard" className="scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
            Learn
          </p>
          <h2 className="mt-1 text-[clamp(1.35rem,3.5vw,1.75rem)] font-black text-[var(--fg)]">
            <Link
              href={ROUTES.blogCategory(categoryId)}
              className="hover:text-[var(--brand)] focus-visible:outline-none"
            >
              {category.label}
            </Link>
          </h2>
        </div>
        {!showAll && posts.length > 6 ? (
          <Link
            href={ROUTES.blogCategoryViewAll(categoryId)}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            More &gt;
          </Link>
        ) : null}
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-1 lg:grid-cols-2">
        {visible.map((post) => (
          <li key={post.slug}>
            <BlogListItem post={post} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
