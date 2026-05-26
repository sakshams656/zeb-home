"use client";

import { OrganizationJsonLd } from "@/components/seo/json-ld";
import type { HomeScreenBodySection } from "@/lib/home-screen-layout";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { PriceTicker } from "./price-ticker";
import { ProductShowcase } from "./product-showcase";
import { CalculatorHub } from "./calculator-hub";
import { Markets } from "./markets";
import { SocialProof } from "./social-proof";
import { Security } from "./security";
import { Announcements } from "./announcements";
import { DiscoverMore } from "./discover-more";
import { Testimonials } from "./testimonials";
import { Faq } from "./faq";
import { Footer } from "./footer";

type LandingPageProps = {
  discoverMoreSection?: HomeScreenBodySection | null;
  announcementsSection?: HomeScreenBodySection | null;
};

export function LandingPage({
  discoverMoreSection = null,
  announcementsSection = null
}: LandingPageProps) {
  return (
    <div className="landing-page">
      <OrganizationJsonLd />
      <Nav />
      <main>
        <Hero />
        <PriceTicker />
        <ProductShowcase />
        <CalculatorHub />
        <Markets />
        <Announcements section={announcementsSection ?? null} />
        <DiscoverMore section={discoverMoreSection ?? null} />
        <SocialProof />
        <Security />
        <Testimonials />
        {/* <AppDownload /> */}
        {/* <Comparison /> */}
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
