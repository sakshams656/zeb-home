import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/blog";
import { getAllPageSlugs, isWordPressConfigured } from "@/lib/wordpress";
import { ROUTES } from "@/lib/routes";
import { getInrCoins } from "@/lib/zebpay-qtcoins-server";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zebpay.com";

const APP_PATHS = [
  ROUTES.markets,
  ROUTES.calculators,
  ROUTES.announcements,
  ROUTES.discover,
  ROUTES.testimonials,
  ROUTES.events,
  ROUTES.expertTrades,
  ROUTES.howToBuy,
  ROUTES.blog,
  ...Object.values(ROUTES.features),
  ROUTES.business.hni,
  ROUTES.business.otc,
  ROUTES.business.listings,
  ROUTES.business.partnerships,
  ROUTES.business.affiliate
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...APP_PATHS.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85
    }))
  ];

  let howToBuyRoutes: MetadataRoute.Sitemap = [];
  try {
    const coins = await getInrCoins();
    howToBuyRoutes = coins.map((coin) => ({
      url: `${base}${ROUTES.howToBuyCoin(coin.symbol)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75
    }));
  } catch {
    // qtcoins API unavailable at build time — hub still listed in staticRoutes
  }

  const withHowToBuy = [...staticRoutes, ...howToBuyRoutes];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllBlogSlugs();
    blogRoutes = slugs.map((slug) => ({
      url: `${base}${ROUTES.blogPost(slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));
  } catch {
    // RSS unavailable at build time
  }

  const withBlog = [...withHowToBuy, ...blogRoutes];

  if (!isWordPressConfigured()) return withBlog;

  const slugs = await getAllPageSlugs();
  const cmsRoutes = slugs
    .filter((s) => s && s !== "home")
    .map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

  return [...withBlog, ...cmsRoutes];
}
