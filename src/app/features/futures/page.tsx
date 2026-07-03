import type { Metadata } from "next";
import { ProductFeatureContent } from "@/components/features/product-feature-content";
import { SiteShell } from "@/components/layout/site-shell";
import { getProductFeatureById } from "@/lib/product-features";

const feature = getProductFeatureById("futures");

export const metadata: Metadata = {
  title: "Futures",
  description: feature.heroDescription,
  alternates: { canonical: feature.featureRoute }
};

export default function FuturesFeaturePage() {
  return (
    <SiteShell>
      <ProductFeatureContent feature={feature} />
    </SiteShell>
  );
}
