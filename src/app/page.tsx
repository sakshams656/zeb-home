import { LandingPage } from "@/components/landing/landing-page";
import { DUMMY_ANNOUNCEMENTS_SECTION } from "@/lib/home-screen-announcements-dummy";
import {
  fetchHomeScreenLayout,
  getDiscoverMoreSection,
  getMaintenanceAnnouncementsSection
} from "@/lib/home-screen-layout";

export default async function Home() {
  const layout = await fetchHomeScreenLayout("IN");
  const body = layout?.data.body ?? [];

  return (
    <LandingPage
      discoverMoreSection={getDiscoverMoreSection(body) ?? null}
      announcementsSection={
        getMaintenanceAnnouncementsSection(body) ?? DUMMY_ANNOUNCEMENTS_SECTION
      }
    />
  );
}
