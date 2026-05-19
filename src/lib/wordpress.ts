import type { WpMenuItem, WpPage, WpPost } from "@/types/wordpress";

const WP_GRAPHQL = process.env.WORDPRESS_GRAPHQL_URL;
const REVALIDATE = Number(process.env.WORDPRESS_REVALIDATE_SECONDS ?? 300);

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function wpFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  if (!WP_GRAPHQL) return null;

  const res = await fetch(WP_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE }
  });

  if (!res.ok) return null;
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    console.error("[WPGraphQL]", json.errors.map((e) => e.message).join("; "));
    return null;
  }
  return json.data ?? null;
}

const PAGE_BY_URI = `
  query PageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      title
      content
      date
      modified
      slug
      seo {
        title
        metaDesc
        canonical
        opengraphImage { sourceUrl }
      }
    }
  }
`;

const ALL_PAGE_URIS = `
  query AllPages {
    pages(first: 100, where: { status: PUBLISH }) {
      nodes { uri slug modified }
    }
  }
`;

const RECENT_POSTS = `
  query RecentPosts {
    posts(first: 10, where: { status: PUBLISH }) {
      nodes {
        slug
        title
        excerpt
        date
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const uri = slug === "home" || slug === "" ? "/" : `/${slug}/`;
  const data = await wpFetch<{
    page: {
      title: string;
      content: string;
      modified: string;
      slug: string;
      seo?: {
        title?: string;
        metaDesc?: string;
        canonical?: string;
        opengraphImage?: { sourceUrl: string };
      };
    } | null;
  }>(PAGE_BY_URI, { uri });

  if (!data?.page) return null;
  const p = data.page;
  return {
    slug: p.slug,
    title: p.title,
    content: p.content,
    modified: p.modified,
    seo: {
      title: p.seo?.title,
      description: p.seo?.metaDesc,
      canonical: p.seo?.canonical,
      ogImage: p.seo?.opengraphImage?.sourceUrl
    }
  };
}

export async function getAllPageSlugs(): Promise<string[]> {
  const data = await wpFetch<{
    pages: { nodes: { slug: string }[] };
  }>(ALL_PAGE_URIS);
  return data?.pages.nodes.map((n) => n.slug).filter(Boolean) ?? [];
}

export async function getRecentPosts(): Promise<WpPost[]> {
  const data = await wpFetch<{
    posts: {
      nodes: {
        slug: string;
        title: string;
        excerpt: string;
        date: string;
        featuredImage?: { node: { sourceUrl: string; altText?: string } };
      }[];
    };
  }>(RECENT_POSTS);

  return (
    data?.posts.nodes.map((n) => ({
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      date: n.date,
      featuredImage: n.featuredImage?.node
        ? { url: n.featuredImage.node.sourceUrl, alt: n.featuredImage.node.altText }
        : undefined
    })) ?? []
  );
}

/** Fallback nav when WP menu is not wired yet */
export const STATIC_NAV: WpMenuItem[] = [
  { label: "Markets", url: "/#markets" },
  { label: "Spot", url: "/#features" },
  { label: "Futures", url: "/#features" },
  { label: "Earn", url: "/#features" },
  { label: "APIs", url: "/#features" },
  { label: "AI Insights", url: "/#features" },
  { label: "By the numbers", url: "/#adoption" }
];

export function isWordPressConfigured(): boolean {
  return Boolean(WP_GRAPHQL);
}
