export function expertRoiCalc(params: {
  allocationInr: number;
  monthlyReturnPercent: number;
  months: number;
}): { projectedValue: number; pnl: number; roiPercent: number } {
  const r = params.monthlyReturnPercent / 100;
  const projectedValue =
    params.allocationInr * Math.pow(1 + r, params.months);
  const pnl = projectedValue - params.allocationInr;
  return {
    projectedValue,
    pnl,
    roiPercent: (pnl / params.allocationInr) * 100
  };
}
