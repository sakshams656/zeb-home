import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";
import { DUMMY_ANNOUNCEMENTS_SECTION } from "@/lib/home-screen-announcements-dummy";
import { fetchHomeScreenLayout, getMaintenanceAnnouncementsSection } from "@/lib/home-screen-layout";

const Announcements = dynamic(
  () => import("@/components/landing/announcements").then((m) => ({ default: m.Announcements }))
);

export const metadata: Metadata = {
  title: "Announcements",
  description: "Product updates and maintenance notices from ZebPay."
};

export default async function AnnouncementsPage() {
  const layout = await fetchHomeScreenLayout("IN");
  const body = layout?.data.body ?? [];
  const section =
    getMaintenanceAnnouncementsSection(body) ?? DUMMY_ANNOUNCEMENTS_SECTION;

  return (
    <SiteShell>
      <Announcements section={section} />
    </SiteShell>
  );
}
