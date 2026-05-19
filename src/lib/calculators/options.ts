export function optionsPayoffCalc(params: {
  spotPrice: number;
  strikePrice: number;
  premium: number;
  type: "call" | "put";
  contracts: number;
}): {
  intrinsicAtSpot: number;
  netPnl: number;
  breakEven: number;
} {
  const mult = params.contracts;
  let intrinsic = 0;
  if (params.type === "call") {
    intrinsic = Math.max(0, params.spotPrice - params.strikePrice) * mult;
  } else {
    intrinsic = Math.max(0, params.strikePrice - params.spotPrice) * mult;
  }
  const totalPremium = params.premium * mult;
  const netPnl = intrinsic - totalPremium;
  const breakEven =
    params.type === "call"
      ? params.strikePrice + params.premium
      : params.strikePrice - params.premium;
  return { intrinsicAtSpot: intrinsic, netPnl, breakEven };
}
