import {
  STETH_ROUNDING_THRESHOLD,
  type BondBalance,
  type FeeSplit,
  type FrameInfo,
  type NodeOperatorInfo,
  type Rewards,
  type StethPoolData,
} from '@lidofinance/lido-csm-sdk';
import { Address, parseEther } from 'viem';

// Pure builders + fixtures for the claim-bond test stand. Intentionally free of
// wagmi / web3-provider imports so the scenario unit tests stay lightweight —
// the mock wagmi config lives in `./mock-wagmi`.

const eth = (n: number) => parseEther(n.toString());

export const MOCK_CLAIMER: Address =
  '0x1111111111111111111111111111111111111111';
export const MOCK_REWARDS_ADDRESS: Address =
  '0x2222222222222222222222222222222222222222';

export const MOCK_POOL_DATA: StethPoolData = {
  totalPooledEther: parseEther('1000000'),
  totalShares: parseEther('900000'),
};

// Far-future nextReport so getNextDistribution renders "on <date>", not "soon".
export const MOCK_FRAME: FrameInfo = {
  lastReport: 1700000000,
  nextReport: 4102444800,
  frameDuration: 28 * 24 * 60 * 60,
};

export type RawBond = {
  /** held bond, ether */
  current: number;
  /** forKeys-only requirement, ether (matches SDK BondBalance.required) */
  forKeys: number;
  locked?: number;
  /** Unsettled bond debt. Real-world invariant: debt is burned from the bond on
   * every touch, so debt > 0 only ever coexists with current === 0. */
  debt?: number;
  pendingToSplit?: number;
  /** Wei shaved off `current` to model a sub-precision forKeys deficit (e.g. 5
   * → current sits 5 wei below forKeys). The SDK clamps such share-rounding
   * dust to Excess Bond 0.0; used to check no "compensate" copy leaks through. */
  deficitWei?: number;
};

// Mirrors calcBondBalance output semantics: required = forKeys, delta =
// |current - forKeys| clamped to 0 within STETH_ROUNDING_THRESHOLD (share-
// rounding dust), isInsufficient = current < forKeys beyond that threshold.
export const makeBond = ({
  current,
  forKeys,
  locked = 0,
  debt = 0,
  pendingToSplit = 0,
  deficitWei = 0,
}: RawBond): BondBalance => {
  const c = eth(current) - BigInt(deficitWei);
  const required = eth(forKeys);
  const raw = c - required;
  const delta = raw < 0n && raw > -STETH_ROUNDING_THRESHOLD ? 0n : raw;
  return {
    required,
    current: c,
    locked: eth(locked),
    debt: eth(debt),
    pendingToSplit: eth(pendingToSplit),
    delta: delta < 0n ? -delta : delta,
    isInsufficient: delta < 0n,
  };
};

export const makeRewards = (available: number): Rewards => ({
  available: eth(available),
  shares: eth(available),
  proof: [],
});

// sharesPct in percent (50 → 5000n basis points); recipients are deterministic.
export const makeFeeSplits = (...sharesPct: number[]): FeeSplit[] =>
  sharesPct.map((pct, i) => ({
    recipient: `0x${String(i + 1)
      .repeat(40)
      .slice(0, 40)}`,
    share: BigInt(Math.round(pct * 100)),
  }));

export const makeOperatorInfo = ({
  rewardsAddress,
}: {
  rewardsAddress: Address;
}): NodeOperatorInfo =>
  ({
    totalAddedKeys: 10,
    totalWithdrawnKeys: 0,
    totalDepositedKeys: 8,
    totalVettedKeys: 10,
    stuckValidatorsCount: 0,
    depositableValidatorsCount: 2,
    targetLimit: 0,
    targetLimitMode: 0,
    totalExitedKeys: 0,
    enqueuedCount: 0,
    managerAddress: MOCK_CLAIMER,
    rewardsAddress,
    extendedManagerPermissions: false,
    usedPriorityQueue: false,
  }) as NodeOperatorInfo;
