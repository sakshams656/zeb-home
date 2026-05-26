import type { HomeScreenBodySection } from "@/lib/home-screen-layout";

/** Fallback announcements block when the home-screen layout API is unavailable. */
export const DUMMY_ANNOUNCEMENTS_SECTION: HomeScreenBodySection = {
  id: "maintenance",
  order: 4,
  visible: true,
  template_type: "annoucment_cards",
  config: {
    header: {
      cta_action: {
        click_action: {
          analytics: {
            event_name: "",
            params: [],
            supported_tool: ["firebase"]
          },
          deeplink: "zebpay://Announcement"
        },
        text: ""
      },
      title: "ANNOUNCEMENTS"
    },
    max_items: 10,
    max_pager_items: 10,
    max_subtitle_line: 1,
    max_title_line: 1,
    min_subtitle_line: 1,
    min_title_line: 1,
    scroll_duration: 5000,
    type: "scroll"
  },
  data: [
    {
      click_action: {
        analytics: {
          event_name: "homepage_announcement_click",
          params: [{ key: "card_name", value: "scheduled_maintenance" }],
          supported_tool: ["adjust", "firebase", "moengage"]
        },
        deeplink: "zebpay://bottomsheet?type=2"
      },
      description: "On 13th May 26 (11 PM - 12 AM IST)",
      icon_identifier:
        "https://zebpay-home-screen.s3.ap-southeast-1.amazonaws.com/resources/KYC_continueverification.png",
      stroke_color: "#D9E5FD",
      title: "Scheduled Maintenance- kyc"
    },
    {
      click_action: {
        analytics: {
          event_name: "homepage_announcement_click",
          params: [{ key: "card_name", value: "coin_delisting" }],
          supported_tool: ["adjust", "firebase", "moengage"]
        },
        deeplink: "zebpay://bottomsheet?type=1"
      },
      description: "On 21st Apr 2026 (12:00 PM IST)",
      icon_identifier: "https://static.zebpay.com/multicoins/ic_coin_oxt.png",
      stroke_color: "#D9E5FD",
      title: "Delisting of OXT & FUN "
    }
  ]
};
