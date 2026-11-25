import type { Interval } from './bond-curve';

type CalcMaxAprParams = {
  /** stETH APR as a fraction (0.0231 = 2.31%) */
  stApr: number;
  /** wei per key from `minKeyNumber` */
  bondConfig: Interval[];
  /** bps of gross validator rewards per key from `minKeyNumber` */
  rewardsConfig: Interval[];
  /** ETH staked per key (32 or 2048) */
  stakePerKey: number;
};

const LIDO_PROTOCOL_FEE = 0.1;
const MAX_KEYS = 2000;
const WEI = 1e18;
const BPS = 10000;

const lastValue = (intervals: Interval[]) =>
  intervals[intervals.length - 1]?.value ?? 0n;

/** Returns the cumulative cost of keys 1..n; call with n = 1, 2, 3, ... */
const runningTotal = (intervals: Interval[]) => {
  let total = 0n;
  let current = -1;
  return (n: number) => {
    while (intervals[current + 1]?.minKeyNumber <= n) current++;
    if (current >= 0) total += intervals[current].value;
    return total;
  };
};

/** Max operator APR in percent, truncated to 2 decimals. */
export const calcMaxApr = ({
  stApr,
  bondConfig,
  rewardsConfig,
  stakePerKey,
}: CalcMaxAprParams): number => {
  const gross = stApr / (1 - LIDO_PROTOCOL_FEE);
  const grossPerKey = gross * stakePerKey;

  const bondTotal = runningTotal(bondConfig);
  const rewardsTotal = runningTotal(rewardsConfig);

  let best = 0;
  for (let n = 1; n <= MAX_KEYS; n++) {
    const bond = Number(bondTotal(n)) / WEI;
    const share = Number(rewardsTotal(n)) / BPS;
    if (bond <= 0) continue;
    best = Math.max(best, stApr + (grossPerKey * share) / bond);
  }

  const trend = Number(lastValue(bondConfig)) / WEI;
  if (trend > 0) {
    const share = Number(lastValue(rewardsConfig)) / BPS;
    best = Math.max(best, stApr + (grossPerKey * share) / trend);
  }

  return Math.trunc(best * 100 * 100) / 100;
};
