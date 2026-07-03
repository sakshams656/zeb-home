import type { MetadataRoute } from "next";
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

  if (!isWordPressConfigured()) return withHowToBuy;

  const slugs = await getAllPageSlugs();
  const cmsRoutes = slugs
    .filter((s) => s && s !== "home")
    .map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

  return [...withHowToBuy, ...cmsRoutes];
}
