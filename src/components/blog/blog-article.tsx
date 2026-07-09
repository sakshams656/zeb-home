import Link from "next/link";
import { BlogArticleContent } from "@/components/blog/blog-article-content";
import { BlogImage } from "@/components/blog/blog-image";
import { RelatedBlogs } from "@/components/blog/related-blogs";
import { Section } from "@/components/ui/section";
import { formatBlogDate } from "@/lib/blog";
import { getCategoryById } from "@/lib/blog-categories";
import { ROUTES } from "@/lib/routes";
import type { BlogPost } from "@/types/blog";

type BlogArticleProps = {
  post: BlogPost;
  related: BlogPost[];
};

export function BlogArticle({ post, related }: BlogArticleProps) {
  const category = getCategoryById(post.category);

  return (
    <>
      <Section
        variant="standard"
        className="pt-14 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-24"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg-muted)]">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href={ROUTES.home} className="hover:text-[var(--brand)]">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={ROUTES.blog} className="hover:text-[var(--brand)]">
                    The Z Blog
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={ROUTES.blogCategory(post.category)}
                    className="hover:text-[var(--brand)]"
                  >
                    {category.label}
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[var(--brand-tint-border)] bg-[var(--brand-tint)] px-2.5 py-0.5 text-xs font-bold text-[var(--brand)]">
                  {category.label}
                </span>
                <time dateTime={post.date} className="text-sm text-[var(--fg-subtle)]">
                  {formatBlogDate(post.date)}
                </time>
              </div>
              <h1 className="mt-3 text-[clamp(2rem,5vw,2.75rem)] font-black leading-tight text-[var(--fg)]">
                {post.title}
              </h1>
              {post.tags.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--fg-subtle)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {post.image ? (
              <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[var(--surface-strong)]">
                <BlogImage
                  src={post.image.url}
                  alt={post.image.alt ?? post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            <article className="mt-8 min-w-0 lg:mt-10">
              <BlogArticleContent html={post.content} />
            </article>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <RelatedBlogs posts={related} currentSlug={post.slug} />
          </div>
        </div>
      </Section>

      <Section variant="compact">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
          <p className="text-[var(--fg-muted)]">
            Ready to start trading?{" "}
            <Link href={ROUTES.features.sip} className="font-semibold text-[var(--brand)]">
              Try Bitcoin SIP
            </Link>{" "}
            or explore{" "}
            <Link href={ROUTES.markets} className="font-semibold text-[var(--brand)]">
              live markets
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
