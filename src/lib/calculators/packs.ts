export function packReturnCalc(params: {
  monthlyContribution: number;
  years: number;
  cagrPercent: number;
}): { totalInvested: number; projectedValue: number; gains: number } {
  const months = params.years * 12;
  const r = params.cagrPercent / 100 / 12;
  let value = 0;
  for (let i = 0; i < months; i++) {
    value = (value + params.monthlyContribution) * (1 + r);
  }
  const totalInvested = params.monthlyContribution * months;
  return {
    totalInvested,
    projectedValue: value,
    gains: value - totalInvested
  };
}
