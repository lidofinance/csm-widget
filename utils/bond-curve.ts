/**
 * Client-side reconstruction of the on-chain bond curve, computed from the
 * `{ minKeyNumber, value }` intervals exposed by `CurveParameters.bondConfig`.
 *
 * Mirrors the contract semantics (and the SDK's `findKeyInterval`): intervals
 * are 1-based and interval `i` covers keys `[minKeyNumber_i, minKeyNumber_{i+1} - 1]`,
 * where `value` is the per-key bond (trend) within that interval. The last
 * interval is unbounded.
 *
 * Intentionally SDK-free so it stays unit-testable (the SDK barrel pulls ESM
 * that Jest cannot load); the structural `Interval` type matches `bondConfig`.
 */
type Interval = { minKeyNumber: number; value: bigint };

/** Total bond required to fund `count` keys. */
export const bondForKeys = (intervals: Interval[], count: number): bigint => {
  if (count <= 0) return 0n;

  let total = 0n;
  for (let i = 0; i < intervals.length; i++) {
    const start = intervals[i].minKeyNumber;
    if (count < start) break;

    const next = intervals[i + 1]?.minKeyNumber ?? Infinity;
    const lastKey = Math.min(count, next - 1);
    total += BigInt(lastKey - start + 1) * intervals[i].value;
  }
  return total;
};

/** Maximum number of keys `amount` can fund on the given curve (floored). */
export const maxKeysForBond = (
  intervals: Interval[],
  amount: bigint,
): number => {
  if (amount <= 0n) return 0;

  let spent = 0n;
  let keys = 0;
  for (let i = 0; i < intervals.length; i++) {
    const { minKeyNumber: start, value: trend } = intervals[i];
    const next = intervals[i + 1]?.minKeyNumber ?? Infinity;
    const keysInInterval = next - start; // Infinity for the last interval

    // Fully fund this interval and move on when we can afford all of it.
    if (Number.isFinite(keysInInterval)) {
      const fullCost = BigInt(keysInInterval) * trend;
      if (spent + fullCost <= amount) {
        spent += fullCost;
        keys += keysInInterval;
        continue;
      }
    }

    // Otherwise buy as many keys as the remainder allows, then stop.
    if (trend > 0n) keys += Number((amount - spent) / trend);
    break;
  }
  return keys;
};
