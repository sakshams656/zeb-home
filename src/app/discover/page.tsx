import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";
import { fetchHomeScreenLayout, getDiscoverMoreSection } from "@/lib/home-screen-layout";

const DiscoverMore = dynamic(
  () => import("@/components/landing/discover-more").then((m) => ({ default: m.DiscoverMore }))
);

export const metadata: Metadata = {
  title: "Discover",
  description: "Videos, guides, and learning content from ZebPay."
};

export default async function DiscoverPage() {
  const layout = await fetchHomeScreenLayout("IN");
  const body = layout?.data.body ?? [];
  const section = getDiscoverMoreSection(body) ?? null;

  return (
    <SiteShell>
      <DiscoverMore section={section} />
    </SiteShell>
  );
}
