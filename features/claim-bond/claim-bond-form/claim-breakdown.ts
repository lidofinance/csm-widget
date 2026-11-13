import type { BondBalance, Rewards } from '@lidofinance/lido-csm-sdk';
import { PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { bigMax, bigMin } from 'utils/bigint-utils';
import { CLAIM_OPTION, type ClaimBondCalculation } from './context/types';

export type ClaimBreakdown = {
  /** stETH from incoming rewards absorbed by bond top-up to cover forKeys + locked deficit (debt cover tracked separately as `debtBurned`). */
  coverAmount: bigint;
  /** Gross stETH flowing into the splitter contract (basis for per-recipient share). */
  splittableGross: bigint;
  /** Total stETH paid to splitter recipients (sum across all = gross × Σshare). */
  splittable: bigint;
  /** stETH that will be delivered to the Rewards Address. */
  toRA: bigint;
  /** Amount the Rewards Address will receive in the operator-selected token (wstETH shares for wstETH, stETH otherwise). */
  toRAToken: bigint;
  token: TOKENS;
  /** Change in Excess Bond (positive = grows, negative = shrinks). */
  bondDelta: bigint;
  debtBurned: bigint;
  debtRemain: bigint;
  /** Whether a rewards proof will be submitted (rewards pulled in). */
  includesRewards: boolean;
  hasSplits: boolean;
  /** Whether the user explicitly redirects rewards to bond (no RA payout). */
  isRewardsToBond: boolean;
};

export type ClaimBreakdownInput = {
  token: TOKENS;
  amount?: bigint | null;
  claimOption: CLAIM_OPTION;
};

export type ClaimBreakdownData = {
  bond: Pick<
    BondBalance,
    'current' | 'required' | 'locked' | 'debt' | 'pendingToSplit'
  >;
  rewards: Pick<Rewards, 'available'>;
  feeSplits: unknown[];
  calculation: Pick<ClaimBondCalculation, 'totalShare'>;
};

export type ShareConverter = {
  toShares: (steth: bigint) => bigint;
  toSteth: (shares: bigint) => bigint;
};

// Mirrors Accounting._pullAndSplitFeeRewards (Accounting.sol:460-502):
//   1. distribute R into bond, increase pendingToSplit by R
//   2. _coverBondDebt burns min(debt, current+R) from bond
//   3. claimable = saturatingSub(current+R, required+locked+debt)
//   4. splittableGross = min(claimable, pendingToSplit+R) flows to FeeSplits
//   5. splitter pays Σshare/PERCENT_BASIS of gross to recipients; remainder
//      stays in bond as additional excess
//   6. toRA = min(userClaim, claimable - splitterCut)
// SDK note: bond.required equals forKeys only; bond.locked and bond.debt are separate fields.
export const computeClaimBreakdown = (
  { token, amount, claimOption }: ClaimBreakdownInput,
  { bond, rewards, feeSplits, calculation: { totalShare } }: ClaimBreakdownData,
  convert: ShareConverter,
): ClaimBreakdown => {
  const isRewardsToBond = claimOption === CLAIM_OPTION.REWARDS_TO_BOND;
  const includesRewards = claimOption !== CLAIM_OPTION.BOND_TO_RA;
  const hasSplits = feeSplits.length > 0;

  const distributed = includesRewards ? rewards.available : 0n;

  const claimablePre = bigMax(
    0n,
    bond.current - bond.required - bond.locked - bond.debt,
  );
  const claimable = bigMax(
    0n,
    bond.current + distributed - bond.required - bond.locked - bond.debt,
  );
  const totalAbsorbed = distributed - (claimable - claimablePre);
  // _coverBondDebt only runs inside _creditBondShares, i.e. when a rewards
  // proof is submitted. BOND_TO_RA passes no proof, so debt is untouched.
  const debtBurned = includesRewards
    ? bigMin(bond.debt, bond.current + distributed)
    : 0n;
  const debtRemain = bond.debt - debtBurned;
  // Of `debtBurned`, the part paid by fresh rewards is bounded by `distributed`;
  // what is left of the absorbed rewards filled the forKeys + locked deficit.
  const debtCoveredFromRewards = bigMin(distributed, debtBurned);
  const coverAmount = bigMax(0n, totalAbsorbed - debtCoveredFromRewards);

  const splittableGross = hasSplits
    ? bigMin(claimable, bond.pendingToSplit + distributed)
    : 0n;
  const splittable = (splittableGross * totalShare) / PERCENT_BASIS;

  const userClaimSteth = isRewardsToBond
    ? 0n
    : token === TOKENS.wsteth
      ? convert.toSteth(amount ?? 0n)
      : (amount ?? 0n);

  const toRA = bigMin(userClaimSteth, claimable - splittable);
  // The contract pays wstETH as the share-equivalent of `toRA`; stETH/ETH go out 1:1.
  const toRAToken = token === TOKENS.wsteth ? convert.toShares(toRA) : toRA;

  const bondDelta = claimable - claimablePre - splittable - toRA;

  return {
    coverAmount,
    splittableGross,
    splittable,
    toRA,
    toRAToken,
    token,
    bondDelta,
    debtBurned,
    debtRemain,
    includesRewards,
    hasSplits,
    isRewardsToBond,
  };
};
