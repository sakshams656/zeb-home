import { NextResponse } from "next/server";
import { COIN_GECKO_IDS, MARKETS_DISPLAY_SYMS } from "@/lib/coingecko";
import { fetchMarketsCoinsServer } from "@/lib/coingecko-server";

export async function GET() {
  try {
    const ids = MARKETS_DISPLAY_SYMS.map((s) => COIN_GECKO_IDS[s]).filter(Boolean).join(",");
    const rows = await fetchMarketsCoinsServer(ids);
    const order = new Map(MARKETS_DISPLAY_SYMS.map((s, i) => [s.toUpperCase(), i]));
    const sorted = [...rows].sort(
      (a, b) =>
        (order.get(a.symbol.toUpperCase()) ?? 99) -
        (order.get(b.symbol.toUpperCase()) ?? 99)
    );
    return NextResponse.json(sorted);
  } catch (err) {
    const message = err instanceof Error ? err.message : "CoinGecko fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
