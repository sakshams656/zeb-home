export function earnApyCalc(params: {
  principal: number;
  apyPercent: number;
  months: number;
}): { earnings: number; finalBalance: number; monthlyBalances: number[] } {
  const m = params.apyPercent / 100 / 12;
  const monthlyBalances = Array.from({ length: params.months + 1 }, (_, i) =>
    params.principal * Math.pow(1 + m, i)
  );
  const finalBalance = monthlyBalances[monthlyBalances.length - 1];
  return {
    earnings: finalBalance - params.principal,
    finalBalance,
    monthlyBalances
  };
}
