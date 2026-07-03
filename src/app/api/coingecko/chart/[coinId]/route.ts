import { NextResponse } from "next/server";
import { fetchCoinMarketChartServer } from "@/lib/coingecko-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ coinId: string }> }
) {
  const { coinId } = await params;
  const days = 1;
  try {
    const points = await fetchCoinMarketChartServer(coinId, days);
    return NextResponse.json(points);
  } catch (err) {
    const message = err instanceof Error ? err.message : "CoinGecko chart fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
