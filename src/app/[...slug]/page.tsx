import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/landing/nav";
import { CmsContent } from "@/components/cms/cms-content";
import { Footer } from "@/components/landing/footer";
import { getAllPageSlugs, getPageBySlug, isWordPressConfigured } from "@/lib/wordpress";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  if (!isWordPressConfigured()) return [];
  const slugs = await getAllPageSlugs();
  return slugs
    .filter((s) => s && s !== "home")
    .map((slug) => ({ slug: slug.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = slug?.join("/") ?? "";
  const page = await getPageBySlug(path);
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    alternates: page.seo?.canonical ? { canonical: page.seo.canonical } : undefined,
    openGraph: page.seo?.ogImage ? { images: [page.seo.ogImage] } : undefined
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const path = slug?.join("/") ?? "";

  if (!isWordPressConfigured()) {
    return (
      <WpPlaceholder path={path} message="WordPress GraphQL is not configured. Set WORDPRESS_GRAPHQL_URL in .env.local." />
    );
  }

  const page = await getPageBySlug(path);
  if (!page) notFound();

  return (
    <>
      <Nav />
      <main className="container-zeb py-16">
        <article>
          <h1 className="mb-6 text-3xl font-black text-[var(--text)]">{page.title}</h1>
          <CmsContent html={page.content} className="max-w-none" />
        </article>
      </main>
      <Footer />
    </>
  );
}

function WpPlaceholder({ path, message }: { path: string; message: string }) {
  return (
    <>
      <Nav />
      <main className="container-zeb py-20 text-center">
        <p className="text-sm text-[var(--text-muted)]">{message}</p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text)]">/{path || "page"}</h1>
        <p className="mt-4 text-[var(--text-muted)]">
          This route is ready for headless WordPress. Content will render here once WPGraphQL is connected.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          ← Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
