import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeader } from "@/components/layout/page-header";
import { LINKS } from "@/lib/links";

const FeatureHub = dynamic(
  () => import("@/components/landing/feature-hub").then((m) => ({ default: m.FeatureHub }))
);

export const metadata: Metadata = {
  title: "Expert Trades",
  description: "Copy expert signals and model ROI with ZebPay Pro trading tools."
};

export default function ExpertTradesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Pro Trading"
        title="Expert trades"
        description="Follow curated strategies and estimate copy-trade returns before you commit capital."
      >
        <a href={LINKS.getStarted} className="btn-primary">
          Start copy trading
        </a>
      </PageHeader>
      <FeatureHub />
    </SiteShell>
  );
}
