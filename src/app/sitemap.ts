import type { MetadataRoute } from "next";
import { getAllPageSlugs, isWordPressConfigured } from "@/lib/wordpress";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zebpay.com";

const PRODUCT_PATHS = ["/earn", "/futures", "/sip", "/cryptopacks"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...PRODUCT_PATHS.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85
    }))
  ];

  if (!isWordPressConfigured()) return staticRoutes;

  const slugs = await getAllPageSlugs();
  const cmsRoutes = slugs
    .filter((s) => s && s !== "home")
    .map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

  return [...staticRoutes, ...cmsRoutes];
}
