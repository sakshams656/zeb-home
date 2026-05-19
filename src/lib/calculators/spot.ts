export function spotFeeCalc(params: {
  amountInr: number;
  feePercent: number;
  side: "buy" | "sell";
}): { totalCost: number; fee: number; netReceived: number } {
  const fee = params.amountInr * (params.feePercent / 100);
  if (params.side === "buy") {
    return {
      totalCost: params.amountInr + fee,
      fee,
      netReceived: params.amountInr
    };
  }
  return {
    totalCost: params.amountInr,
    fee,
    netReceived: params.amountInr - fee
  };
}
