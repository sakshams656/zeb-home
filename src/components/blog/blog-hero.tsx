import { Section } from "@/components/ui/section";

export function BlogHero() {
  return (
    <Section variant="compact" className="pt-14 pb-6 sm:pt-[4.5rem] sm:pb-8 lg:pt-24 lg:pb-10">
      <h1 className="text-center text-[clamp(2rem,6vw,3.5rem)] font-black leading-tight text-[var(--fg)]">
        Making sense of modern crypto
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-base text-[var(--fg-muted)] sm:text-lg">
        Bitcoin insights, market analysis, and crypto news from India&apos;s most trusted exchange.
      </p>
    </Section>
  );
}
