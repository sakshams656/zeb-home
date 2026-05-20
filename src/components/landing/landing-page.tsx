"use client";

import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { PriceTicker } from "./price-ticker";
import { ProductShowcase } from "./product-showcase";
import { CalculatorHub } from "./calculator-hub";
import { Markets } from "./markets";
import { SocialProof } from "./social-proof";
import { CryptoPacks } from "./crypto-packs";
import { Earn } from "./earn";
import { Security } from "./security";
import { ProBento } from "./pro-bento";
import { Testimonials } from "./testimonials";
import { AppDownload } from "./app-download";
import { Comparison } from "./comparison";
import { Faq } from "./faq";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="landing-page bg-[#040812] text-[var(--text-on-dark)]">
      <OrganizationJsonLd />
      <Nav />
      <main>
        <Hero />
        <PriceTicker />
        <ProductShowcase />
        <CalculatorHub />
        <Markets />
        <SocialProof />
        <CryptoPacks />
        <Earn />
        <Security />
        <ProBento />
        <Testimonials />
        <AppDownload />
        <Comparison />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
