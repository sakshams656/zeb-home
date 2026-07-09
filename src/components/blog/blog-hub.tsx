import { BlogCategorySection } from "@/components/blog/blog-category-section";
import { BlogFeaturedRow } from "@/components/blog/blog-featured-row";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogMediaSection } from "@/components/blog/blog-media-section";
import { BlogVideoSection } from "@/components/blog/blog-video-section";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { BLOG_MEDIA_ITEMS, BLOG_VIDEO_ITEMS } from "@/lib/blog-content";
import type { BlogCategoryId, BlogPost } from "@/types/blog";

type BlogHubProps = {
  featured: BlogPost | null;
  popular: BlogPost[];
  postsByCategory: Record<BlogCategoryId, BlogPost[]>;
  activeCategory?: BlogCategoryId;
  showAll?: boolean;
};

export function BlogHub({
  featured,
  popular,
  postsByCategory,
  activeCategory,
  showAll = false
}: BlogHubProps) {
  const categoriesToShow = activeCategory
    ? BLOG_CATEGORIES.filter((c) => c.id === activeCategory)
    : BLOG_CATEGORIES;

  return (
    <>
      {!activeCategory ? <BlogHero /> : null}

      {featured && !activeCategory ? (
        <BlogFeaturedRow featured={featured} popular={popular} />
      ) : null}

      {categoriesToShow.map((cat) => (
        <BlogCategorySection
          key={cat.id}
          categoryId={cat.id}
          posts={postsByCategory[cat.id] ?? []}
          showAll={showAll || Boolean(activeCategory)}
        />
      ))}

      {!activeCategory ? (
        <>
          <BlogMediaSection items={BLOG_MEDIA_ITEMS} />
          <BlogVideoSection items={BLOG_VIDEO_ITEMS} />
        </>
      ) : null}
    </>
  );
}
