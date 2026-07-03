import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { LINKS } from "@/lib/links";

type BusinessPageProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function BusinessPage({ title, description, eyebrow = "Business" }: BusinessPageProps) {
  return (
    <SiteShell>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Section variant="compact">
        <p className="max-w-2xl text-[var(--fg-muted)]">
          Our team is putting the finishing touches on this page. Reach out through the app or
          contact support for HNI, OTC, and partnership enquiries in the meantime.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={LINKS.getStarted} className="btn-primary">
            Get started
          </a>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}

export function businessMetadata(title: string, description: string): Metadata {
  return { title, description };
}
