import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ProductFeatureContent } from "@/components/features/product-feature-content";
import { getProductFeatureById } from "@/lib/product-features";

const feature = getProductFeatureById("aiInsights");

export const metadata: Metadata = {
  title: "AI Insights",
  description: feature.metadataDescription,
  alternates: { canonical: feature.featureRoute }
};

export default function AiInsightsFeaturePage() {
  return (
    <SiteShell>
      <ProductFeatureContent feature={feature} />
    </SiteShell>
  );
}
