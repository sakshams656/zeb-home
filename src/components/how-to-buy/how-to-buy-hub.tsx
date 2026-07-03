"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { QtCoin } from "@/lib/zebpay-qtcoins-server";
import { ROUTES } from "@/lib/routes";

type HubCoin = Pick<QtCoin, "symbol" | "name" | "slug" | "coinIcon">;

export function HowToBuyHub({ coins }: { coins: HubCoin[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }, [coins, query]);

  return (
    <div>
      <label htmlFor="how-to-buy-search" className="sr-only">
        Search cryptocurrencies
      </label>
      <div className="relative max-w-xl">
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]"
        >
          ⌕
        </span>
        <input
          id="how-to-buy-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or symbol (e.g. Bitcoin, BTC)"
          className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-11 pr-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus-visible:border-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-tint-border)]"
        />
      </div>

      <p className="mt-4 text-sm text-[var(--fg-muted)]">
        {filtered.length} {filtered.length === 1 ? "coin" : "coins"}
        {query ? ` matching “${query.trim()}”` : " available"}
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((coin) => (
          <li key={coin.symbol}>
            <Link
              href={ROUTES.howToBuyCoin(coin.symbol)}
              className="flex min-h-11 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--brand-tint-border)] hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <Image
                src={coin.coinIcon}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-[var(--fg)]">{coin.name}</span>
                <span className="text-sm text-[var(--fg-muted)]">{coin.symbol}</span>
              </span>
              <span aria-hidden className="shrink-0 text-[var(--brand)]">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-[var(--fg-muted)]">No coins match your search.</p>
      ) : null}
    </div>
  );
}
