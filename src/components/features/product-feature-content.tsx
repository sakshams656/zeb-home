import { FeatureFaq } from "@/components/features/feature-faq";
import { FeatureIllustration } from "@/components/features/feature-illustration";
import {
  FeatureBenefits,
  FeatureCompare,
  FeatureCtaBand,
  FeatureHero,
  FeatureHighlights,
  FeaturePairsShowcase,
  FeatureScreenshotBand,
  FeatureSteps
} from "@/components/features/feature-sections";
import { Section } from "@/components/ui/section";
import type { ProductFeature } from "@/lib/product-features";

function FeatureTitle({ main, accent }: { main: string; accent?: string }) {
  return (
    <>
      {main}
      {accent ? <span className="text-[var(--brand)]"> {accent}</span> : null}
    </>
  );
}

export function ProductFeatureContent({ feature }: { feature: ProductFeature }) {
  const faqId = `${feature.id}-faq`;

  return (
    <>
      <FeatureHero
        eyebrow={feature.eyebrow}
        title={<FeatureTitle main={feature.heroTitle} accent={feature.heroTitleAccent} />}
        description={feature.heroDescription}
        visual={
          <FeatureIllustration
            src={feature.heroIllustration}
            alt={feature.heroIllustrationAlt}
            priority
          />
        }
        primaryCta={feature.primaryCta}
      />

      <FeatureBenefits items={feature.benefits} />

      {feature.steps && feature.stepsTitle ? (
        <FeatureSteps title={feature.stepsTitle} steps={feature.steps} />
      ) : null}

      {feature.pairsShowcase ? (
        <FeaturePairsShowcase
          title={feature.pairsShowcase.title}
          description={feature.pairsShowcase.description}
          cta={feature.pairsShowcase.cta}
          moreLabel={feature.pairsShowcase.moreLabel}
        />
      ) : null}

      {feature.visualBands.map((band) => (
        <FeatureScreenshotBand
          key={band.title}
          title={band.title}
          description={band.description}
          imageSrc={band.imageSrc}
          imageAlt={band.imageAlt}
          cta={band.cta}
          reverse={band.reverse}
        />
      ))}

      {feature.highlights && feature.highlightsTitle ? (
        <FeatureHighlights title={feature.highlightsTitle} items={feature.highlights} />
      ) : null}

      {feature.compare ? (
        <FeatureCompare
          title={feature.compare.title}
          left={feature.compare.left}
          right={feature.compare.right}
        />
      ) : null}

      <Section variant="standard" aria-labelledby={`${faqId}-heading`}>
        <h2
          id={`${faqId}-heading`}
          className="text-center text-[clamp(1.5rem,4vw,2.25rem)] font-black text-[var(--fg)]"
        >
          Questions you may have
        </h2>
        <div className="mx-auto mt-8 max-w-[760px]">
          <FeatureFaq items={feature.faqs} id={faqId} />
        </div>
      </Section>

      <FeatureCtaBand
        icon={feature.ctaIcon}
        title={feature.ctaBand.title}
        description={feature.ctaBand.description}
        cta={feature.ctaBand.cta}
      />
    </>
  );
}
