const DEFAULT_LAYOUT_URL =
  "https://www.zebapi.com/api/v1/home-screen/layout";

export interface HomeScreenLayoutResponse {
  success: boolean;
  message: string;
  data: {
    header: unknown;
    body: HomeScreenBodySection[];
  };
}

export interface HomeScreenBodySection {
  id: string;
  order: number;
  visible: boolean;
  template_type: string;
  config: Record<string, unknown>;
  data: unknown;
}

export interface AnnouncementCard {
  title: string;
  description: string;
  icon_identifier: string;
  stroke_color: string;
  click_action: {
    deeplink: string;
    analytics?: unknown;
  };
}

export interface AnnouncementCardsConfig {
  header?: {
    title?: string;
    cta_action?: {
      text?: string;
      click_action?: { deeplink?: string };
    };
  };
}

export interface InfoCardItem {
  description: string;
  image_url: string;
  eventTitle?: string;
  eventDescription?: string;
  click_action: {
    deeplink: string;
    analytics?: unknown;
  };
}

export interface InfoCardGroup {
  source: string;
  title: string;
  items: InfoCardItem[];
}

export interface InfoCardsConfig {
  header?: {
    title?: string;
    cta_action?: {
      text?: string;
      click_action?: { deeplink?: string };
    };
  };
}

export async function fetchHomeScreenLayout(
  country = "IN"
): Promise<HomeScreenLayoutResponse | null> {
  const base =
    process.env.NEXT_PUBLIC_HOME_SCREEN_API_URL ?? DEFAULT_LAYOUT_URL;
  const url = `${base}?country=${encodeURIComponent(country)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as HomeScreenLayoutResponse;
    if (!json.success || !json.data?.body) return null;
    return json;
  } catch {
    return null;
  }
}

export function getDiscoverMoreSection(
  body: HomeScreenBodySection[]
): HomeScreenBodySection | undefined {
  return body.find(
    (s) =>
      s.visible &&
      s.template_type === "info_cards" &&
      (s.id === "discover more" ||
        s.id.toLowerCase() === "discover" ||
        s.id.toLowerCase().includes("discover"))
  );
}

export function getMaintenanceAnnouncementsSection(
  body: HomeScreenBodySection[]
): HomeScreenBodySection | undefined {
  return body.find(
    (s) =>
      s.visible &&
      s.id === "maintenance" &&
      s.template_type === "annoucment_cards"
  );
}

export function parseInfoCardGroups(section: HomeScreenBodySection): InfoCardGroup[] {
  if (!Array.isArray(section.data)) return [];
  return section.data.filter(
    (g): g is InfoCardGroup =>
      typeof g === "object" &&
      g !== null &&
      "items" in g &&
      Array.isArray((g as InfoCardGroup).items)
  );
}

export function parseAnnouncementCards(
  section: HomeScreenBodySection
): AnnouncementCard[] {
  if (!Array.isArray(section.data)) return [];
  return section.data.filter(
    (c): c is AnnouncementCard =>
      typeof c === "object" &&
      c !== null &&
      "title" in c &&
      typeof (c as AnnouncementCard).title === "string"
  );
}

/** Extract YouTube video id from youtu.be, watch, embed, or shorts URLs. */
export function youtubeVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id || null;
    }
    if (host.includes("youtube.com")) {
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return shorts[1];
      const v = u.searchParams.get("v");
      if (v) return v;
      const embed = u.pathname.match(/\/embed\/([^/?]+)/);
      if (embed?.[1]) return embed[1];
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export function isWebLink(deeplink: string): boolean {
  return /^https?:\/\//i.test(deeplink);
}
