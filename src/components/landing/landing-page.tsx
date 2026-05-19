"use client";

import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { PersonaBody } from "./persona-body";
import { Nav } from "./nav";
import { PersonaBar } from "./persona-bar";
import { Hero } from "./hero";
import { PriceTicker } from "./price-ticker";
import { FeatureHub } from "./feature-hub";
import { PhoneDemos } from "./phone-demos";
import { AdoptionStrip } from "./adoption-strip";
import { Markets } from "./markets";
import { CryptoPacks } from "./crypto-packs";
import { Earn } from "./earn";
import { ProFeatures } from "./pro-features";
import { Security } from "./security";
import { Comparison } from "./comparison";
import { Steps } from "./steps";
import { Testimonials } from "./testimonials";
import { Faq } from "./faq";
import { AppDownload } from "./app-download";
import { TrustStrip } from "./trust-strip";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <PersonaBody>
      <OrganizationJsonLd />
      <Nav />
      <PersonaBar />
      <main>
        <Hero />
        <PriceTicker />
        <FeatureHub />
        <PhoneDemos />
        <AdoptionStrip />
        <Markets />
        <CryptoPacks />
        <Earn />
        <ProFeatures />
        <Security />
        <Comparison />
        <Steps />
        <Testimonials />
        <Faq />
        <AppDownload />
      </main>
      <TrustStrip />
      <Footer />
    </PersonaBody>
  );
}
