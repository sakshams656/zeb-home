import Image from "next/image";
import Link from "next/link";
import { BuySteps } from "@/components/how-to-buy/buy-steps";
import { CoinFaqs } from "@/components/how-to-buy/coin-faqs";
import { RelatedCoins } from "@/components/how-to-buy/related-coins";
import { Section } from "@/components/ui/section";
import { getBuySteps, getCoinFaqs } from "@/lib/how-to-buy-content";
import { LINKS } from "@/lib/links";
import { ROUTES } from "@/lib/routes";
import type { QtCoin } from "@/lib/zebpay-qtcoins-server";

type HowToBuyCoinPageProps = {
  coin: QtCoin;
  related: QtCoin[];
};

export function HowToBuyCoinPage({ coin, related }: HowToBuyCoinPageProps) {
  const steps = getBuySteps(coin);
  const faqs = getCoinFaqs(coin);

  return (
    <>
      <Section variant="compact" className="border-b border-[var(--border)]">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg-muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.home} className="hover:text-[var(--brand)]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={ROUTES.howToBuy} className="hover:text-[var(--brand)]">
                How to Buy
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-semibold text-[var(--fg)]">{coin.name}</li>
          </ol>
        </nav>

        <div className="mt-6 flex flex-wrap items-start gap-4">
          <Image
            src={coin.coinIcon}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
            priority
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--fg-subtle)]">
              How to Buy
            </p>
            <h1 className="mt-1 text-[clamp(2rem,5vw,2.75rem)] font-black leading-tight text-[var(--fg)]">
              How to Buy {coin.name} ({coin.symbol}) in India
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[var(--fg-muted)]">
              Follow these simple steps to buy {coin.name} on ZebPay. Download the app, complete
              verification, add INR, and purchase {coin.symbol} via Quick Trade in minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={LINKS.exchange} className="btn-hero-primary text-sm sm:text-base">
                Buy {coin.symbol} now
              </a>
              <Link href={ROUTES.howToBuy} className="btn-outline">
                All coins
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="standard">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-12 xl:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-black text-[var(--fg)]">
              Steps to buy {coin.name}
            </h2>
            <p className="mt-2 text-[var(--fg-muted)]">
              Buying {coin.symbol} on ZebPay takes just a few minutes.
            </p>
            <div className="mt-8">
              <BuySteps steps={steps} />
            </div>

            <div className="mt-14">
              <CoinFaqs items={faqs} coinSlug={coin.slug} />
            </div>

            <div className="mt-10 rounded-2xl border border-[var(--brand-tint-border)] bg-[var(--surface)] p-6 text-center sm:p-8">
              <h2 className="text-xl font-black text-[var(--fg)]">Ready to buy {coin.name}?</h2>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Open Quick Trade on ZebPay and get started in minutes.
              </p>
              <a href={LINKS.exchange} className="btn-primary mt-6">
                Trade {coin.symbol} now
              </a>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <RelatedCoins coins={related} />
          </div>
        </div>
      </Section>
    </>
  );
}
