const PERCENT_FACTOR = 100;

/** Converts a ratio (`0.854`) into a whole percentage (`85`). */
export function toPercent(ratio: number): number {
  return Math.round(ratio * PERCENT_FACTOR);
}
