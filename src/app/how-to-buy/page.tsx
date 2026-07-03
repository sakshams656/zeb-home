import type { Metadata } from "next";
import Link from "next/link";
import { HowToBuyHub } from "@/components/how-to-buy/how-to-buy-hub";
import { PageHeader } from "@/components/layout/page-header";
import { SiteShell } from "@/components/layout/site-shell";
import { Section } from "@/components/ui/section";
import { HUB_INTRO } from "@/lib/how-to-buy-content";
import { LINKS } from "@/lib/links";
import { ROUTES } from "@/lib/routes";
import { getInrCoins } from "@/lib/zebpay-qtcoins-server";

export const metadata: Metadata = {
  title: "How to Buy Crypto in India",
  description:
    "Learn how to buy Bitcoin, Ethereum, and 280+ cryptocurrencies in India on ZebPay. Simple steps from sign-up to your first trade.",
  alternates: { canonical: ROUTES.howToBuy }
};

export default async function HowToBuyPage() {
  const coins = await getInrCoins();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Guides"
        title="How to Buy Crypto in India"
        description={HUB_INTRO}
      >
        <a href={LINKS.getStarted} className="btn-hero-primary text-sm sm:text-base">
          Get started on ZebPay
        </a>
      </PageHeader>

      <Section variant="standard">
        <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-black text-[var(--fg)]">
          Explore how to buy popular cryptos
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--fg-muted)]">
          Select a coin below for step-by-step instructions, app screenshots, and FAQs.
        </p>
        <div className="mt-8">
          <HowToBuyHub coins={coins} />
        </div>
      </Section>

      <Section variant="compact">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
          <p className="text-[var(--fg-muted)]">
            New to crypto?{" "}
            <Link href={ROUTES.features.quickTrade} className="font-semibold text-[var(--brand)]">
              Learn about Quick Trade
            </Link>{" "}
            or browse{" "}
            <Link href={ROUTES.markets} className="font-semibold text-[var(--brand)]">
              live markets
            </Link>
            .
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
