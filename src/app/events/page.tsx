import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Events & Meet ups",
  description: "ZebPay community events, meetups, and workshops."
};

export default function EventsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Community"
        title="Events & meet ups"
        description="Join ZebPay at workshops, AMAs, and crypto community events across India."
      />
      <Section variant="compact">
        <p className="max-w-2xl text-[var(--fg-muted)]">
          Our events calendar is being refreshed. Follow the ZebPay blog for the latest
          announcements, or get started on the app while we publish new dates.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={ROUTES.blog} className="btn-primary">
            Visit the blog
          </Link>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
