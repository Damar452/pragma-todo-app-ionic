/** Fraction `part / total`, or `0` when there is no total (avoids dividing by zero). */
export function toRatio(part: number, total: number): number {
  return total > 0 ? part / total : 0;
}
