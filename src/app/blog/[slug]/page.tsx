import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllBlogSlugs, getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const description = post.excerpt.slice(0, 160);

  return {
    title: post.title,
    description,
    alternates: { canonical: ROUTES.blogPost(slug) },
    openGraph: post.image
      ? { images: [{ url: post.image.url, alt: post.image.alt ?? post.title }] }
      : undefined
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(slug, 5);

  return (
    <SiteShell>
      <BlogArticle post={post} related={related} />
    </SiteShell>
  );
}
