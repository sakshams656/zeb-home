import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ProductFeatureContent } from "@/components/features/product-feature-content";
import { getProductFeatureById } from "@/lib/product-features";

const feature = getProductFeatureById("quickTrade");

export const metadata: Metadata = {
  title: "Quick Trade",
  description: feature.metadataDescription,
  alternates: { canonical: feature.featureRoute }
};

export default function QuickTradePage() {
  return (
    <SiteShell>
      <ProductFeatureContent feature={feature} />
    </SiteShell>
  );
}
