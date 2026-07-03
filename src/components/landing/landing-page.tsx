import dynamic from "next/dynamic";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "./hero";
import { PriceTicker } from "./price-ticker";
import { Security } from "./security";
import { Faq } from "./faq";

const ProductShowcase = dynamic(
  () => import("./product-showcase").then((m) => ({ default: m.ProductShowcase }))
);

const SocialProof = dynamic(
  () => import("./social-proof").then((m) => ({ default: m.SocialProof }))
);

const HniInstitutionalSection = dynamic(
  () =>
    import("./hni-institutional-section").then((m) => ({
      default: m.HniInstitutionalSection
    }))
);

export function LandingPage() {
  return (
    <SiteShell>
      <OrganizationJsonLd />
      <Hero />
      <PriceTicker />
      <ProductShowcase />
      <SocialProof />
      <HniInstitutionalSection />
      <Security />
      <Faq />
    </SiteShell>
  );
}
