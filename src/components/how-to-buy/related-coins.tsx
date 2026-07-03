import Image from "next/image";
import Link from "next/link";
import type { QtCoin } from "@/lib/zebpay-qtcoins-server";
import { ROUTES } from "@/lib/routes";

export function RelatedCoins({ coins }: { coins: QtCoin[] }) {
  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-base font-bold text-[var(--fg)]">Related pages</h2>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">Explore how to buy other cryptos</p>
      <ul className="mt-4 flex flex-col gap-1">
        {coins.map((coin) => (
          <li key={coin.symbol}>
            <Link
              href={ROUTES.howToBuyCoin(coin.symbol)}
              className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <Image
                src={coin.coinIcon}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 text-sm font-semibold text-[var(--fg)]">
                How to buy {coin.name}
              </span>
              <span className="ml-auto shrink-0 text-xs font-bold text-[var(--fg-muted)]">
                {coin.symbol}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
