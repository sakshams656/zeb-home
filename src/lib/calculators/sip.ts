export function sipWealthCalc(params: {
  monthly: number;
  years: number;
  annualReturnPercent: number;
}): {
  totalInvested: number;
  finalValue: number;
  yearlyBalances: number[];
} {
  const r = params.annualReturnPercent / 100 / 12;
  const months = params.years * 12;
  const yearlyBalances: number[] = [0];
  let balance = 0;
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + r) + params.monthly;
    if (m % 12 === 0) yearlyBalances.push(balance);
  }
  if (yearlyBalances.length <= params.years) yearlyBalances.push(balance);
  return {
    totalInvested: params.monthly * months,
    finalValue: balance,
    yearlyBalances
  };
}
