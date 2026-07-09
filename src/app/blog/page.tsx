import type { Metadata } from "next";
import { BlogHub } from "@/components/blog/blog-hub";
import { SiteShell } from "@/components/layout/site-shell";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { getAllBlogPosts, getBlogPostsByCategory, getFeaturedBlogPost } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";
import type { BlogCategoryId, BlogPost } from "@/types/blog";

export const metadata: Metadata = {
  title: "The Z Blog — Bitcoin & Crypto Articles",
  description:
    "Read Bitcoin and crypto articles, market analysis, news, and ZebPay announcements. Stay updated on India's digital asset landscape.",
  alternates: { canonical: ROUTES.blog }
};

type Props = {
  searchParams: Promise<{ category?: string; view?: string }>;
};

function isValidCategory(value: string | undefined): value is BlogCategoryId {
  return BLOG_CATEGORIES.some((c) => c.id === value);
}

export default async function BlogPage({ searchParams }: Props) {
  const { category, view } = await searchParams;
  const activeCategory = isValidCategory(category) ? category : undefined;
  const showAll = view === "all";

  const [featured, allPosts, ...categoryResults] = await Promise.all([
    getFeaturedBlogPost(),
    getAllBlogPosts(),
    ...BLOG_CATEGORIES.map((cat) =>
      getBlogPostsByCategory(cat.id, showAll || activeCategory ? 10 : 6)
    )
  ]);

  const popular = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 4);

  const postsByCategory = BLOG_CATEGORIES.reduce(
    (acc, cat, index) => {
      acc[cat.id] = categoryResults[index] as BlogPost[];
      return acc;
    },
    {} as Record<BlogCategoryId, BlogPost[]>
  );

  return (
    <SiteShell>
      <BlogHub
        featured={featured}
        popular={popular}
        postsByCategory={postsByCategory}
        activeCategory={activeCategory}
        showAll={showAll}
      />
    </SiteShell>
  );
}
