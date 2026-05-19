import { BTC_INR } from "@/lib/market-data";

export function futuresMarginCalc(params: {
  marginInr: number;
  leverage: number;
  priceMovePercent: number;
  direction: "LONG" | "SHORT";
  entryPrice?: number;
}): {
  positionSize: number;
  estimatedPnl: number;
  liquidationPrice: number;
} {
  const entry = params.entryPrice ?? BTC_INR;
  const size = params.marginInr * params.leverage;
  const move = params.priceMovePercent / 100;
  const pnl =
    size * (params.direction === "LONG" ? move : -move);
  const liqPct = params.direction === "LONG" ? -90 / params.leverage : 90 / params.leverage;
  const liquidationPrice = entry * (1 + liqPct / 100);
  return { positionSize: size, estimatedPnl: pnl, liquidationPrice };
}
