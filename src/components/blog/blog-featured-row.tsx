import Link from "next/link";
import { BlogImage } from "@/components/blog/blog-image";
import { BlogListItem } from "@/components/blog/blog-list-item";
import { Section } from "@/components/ui/section";
import { ROUTES } from "@/lib/routes";
import type { BlogPost } from "@/types/blog";

type BlogFeaturedRowProps = {
  featured: BlogPost;
  popular: BlogPost[];
};

export function BlogFeaturedRow({ featured, popular }: BlogFeaturedRowProps) {
  return (
    <Section variant="standard" className="pt-6 sm:pt-8 lg:pt-10">
      <div className={`grid gap-10 ${popular.length > 0 ? "lg:grid-cols-[1.15fr_1fr] lg:gap-12" : ""}`}>
        <article>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
            Featured
          </p>
          <Link
            href={ROUTES.blogPost(featured.slug)}
            className="group mt-4 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--surface-strong)]">
              {featured.image ? (
                <BlogImage
                  src={featured.image.url}
                  alt={featured.image.alt ?? featured.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[var(--brand-tint)]">
                  <span className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
                    Featured
                  </span>
                </div>
              )}
            </div>
            <h2 className="mt-5 text-[clamp(1.35rem,3vw,2rem)] font-black leading-tight text-[var(--fg)] group-hover:text-[var(--brand)]">
              {featured.title}
            </h2>
          </Link>
        </article>

        {popular.length > 0 ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
            Popular
          </p>
          <ul className="mt-4 flex flex-col gap-1">
            {popular.map((post) => (
              <li key={post.slug}>
                <BlogListItem post={post} />
              </li>
            ))}
          </ul>
        </div>
        ) : null}
      </div>
    </Section>
  );
}
