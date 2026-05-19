export function makeLinePath(
  data: number[],
  width: number,
  height: number,
  pad = 4
): { line: string; area: string } {
  if (data.length < 2) {
    return { line: "", area: "" };
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (width - 2 * pad),
    y: height - pad - ((v - min) / range) * (height - 2 * pad)
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;
  return { line, area };
}

/** Deterministic hero chart path (avoids SSR/client float drift). */
export const HERO_BTC_SPARK =
  "M 0 28 L 7.272727272727273 19.36869363989855 L 14.545454545454545 4 L 21.818181818181817 8.666666666666666 L 29.09090909090909 12 L 36.36363636363636 16 L 43.63636363636363 20 L 50.90909090909091 24 L 58.18181818181818 28 L 65.45454545454545 24 L 72.72727272727273 20 L 80 16";

export function sparkPath(seed: number, trend: number): string {
  const pts: number[] = [];
  let s = seed;
  for (let i = 0; i < 12; i++) {
    s = Math.sin(s * 12.9898) * 43758.5453;
    pts.push((s - Math.floor(s)) * 20 + (i * trend) / 12);
  }
  const mn = Math.min(...pts);
  const mx = Math.max(...pts);
  return pts
    .map((v, j) => {
      const y = 28 - ((v - mn) / (mx - mn || 1)) * 24;
      const x = j * (80 / 11);
      return `${j === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}
