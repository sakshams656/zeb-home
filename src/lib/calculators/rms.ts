export function rmsRiskCalc(params: {
  entryPrice: number;
  takeProfitPercent: number;
  stopLossPercent: number;
  currentPrice: number;
}): {
  tpPrice: number;
  slPrice: number;
  riskRewardRatio: number;
  progressPercent: number;
} {
  const tpPrice = params.entryPrice * (1 + params.takeProfitPercent / 100);
  const slPrice = params.entryPrice * (1 - params.stopLossPercent / 100);
  const risk = params.entryPrice - slPrice;
  const reward = tpPrice - params.entryPrice;
  const riskRewardRatio = risk > 0 ? reward / risk : 0;
  const progressPercent = Math.min(
    Math.max(((params.currentPrice - slPrice) / (tpPrice - slPrice)) * 100, 0),
    100
  );
  return { tpPrice, slPrice, riskRewardRatio, progressPercent };
}
