export function subAccountSplitCalc(params: {
  totalInr: number;
  weights: number[];
}): { allocations: { index: number; percent: number; amount: number }[] } {
  const sum = params.weights.reduce((a, b) => a + b, 0) || 1;
  return {
    allocations: params.weights.map((w, index) => {
      const percent = (w / sum) * 100;
      return {
        index: index + 1,
        percent,
        amount: (params.totalInr * w) / sum
      };
    })
  };
}
