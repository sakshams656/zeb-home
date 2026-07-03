import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HowToBuyCoinPage } from "@/components/how-to-buy/how-to-buy-coin-page";
import { SiteShell } from "@/components/layout/site-shell";
import { ROUTES } from "@/lib/routes";
import { getCoinBySymbol, getInrCoins, getRelatedCoins } from "@/lib/zebpay-qtcoins-server";

type Props = { params: Promise<{ symbol: string }> };

export async function generateStaticParams() {
  const coins = await getInrCoins();
  return coins.map((coin) => ({ symbol: coin.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const coin = await getCoinBySymbol(symbol);
  if (!coin) return { title: "Coin not found" };

  const title = `How to Buy ${coin.name} (${coin.symbol}) in India`;
  const description = `Step-by-step guide to buying ${coin.name} on ZebPay in India. Download the app, complete KYC, add INR, and purchase ${coin.symbol} via Quick Trade.`;

  return {
    title,
    description,
    alternates: { canonical: ROUTES.howToBuyCoin(coin.symbol) }
  };
}

export default async function HowToBuyCoinRoute({ params }: Props) {
  const { symbol } = await params;
  const coin = await getCoinBySymbol(symbol);
  if (!coin) notFound();

  const related = await getRelatedCoins(coin, 10);

  return (
    <SiteShell>
      <HowToBuyCoinPage coin={coin} related={related} />
    </SiteShell>
  );
}
