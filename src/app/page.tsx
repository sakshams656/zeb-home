import { LandingPage } from "@/components/landing/landing-page";
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
      announcementsSection={getMaintenanceAnnouncementsSection(body) ?? null}
    />
  );
}
