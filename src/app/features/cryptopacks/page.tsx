import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ProductFeatureContent } from "@/components/features/product-feature-content";
import { getProductFeatureById } from "@/lib/product-features";

const feature = getProductFeatureById("cryptopacks");

export const metadata: Metadata = {
  title: "CryptoPacks",
  description: feature.metadataDescription,
  alternates: { canonical: feature.featureRoute }
};

export default function CryptoPacksFeaturePage() {
  return (
    <SiteShell>
      <ProductFeatureContent feature={feature} />
    </SiteShell>
  );
}
