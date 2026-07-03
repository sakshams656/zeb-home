import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ProductFeatureContent } from "@/components/features/product-feature-content";
import { getProductFeatureById } from "@/lib/product-features";

const feature = getProductFeatureById("earn");

export const metadata: Metadata = {
  title: "Earn",
  description: feature.metadataDescription,
  alternates: { canonical: feature.featureRoute }
};

export default function EarnFeaturePage() {
  return (
    <SiteShell>
      <ProductFeatureContent feature={feature} />
    </SiteShell>
  );
}
