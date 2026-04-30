import {
  convertSharesToEth,
  PERCENT_BASIS,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import { bigMax, bigMin } from 'utils';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFormData,
} from '../context';

export type ClaimBreakdown = {
  /** stETH from incoming rewards absorbed by bond top-up (insufficient/locked/debt). */
  coverAmount: bigint;
  /** Gross stETH flowing into the splitter contract (basis for per-recipient share). */
  splittableGross: bigint;
  /** Total stETH paid to splitter recipients (sum across all = gross × Σshare). */
  splittable: bigint;
  /** stETH that will be delivered to the Rewards Address. */
  toRA: bigint;
  /** Change in Excess Bond (positive = grows, negative = shrinks). */
  bondDelta: bigint;
  /** Bond debt burned during this tx. */
  debtBurned: bigint;
  /** Bond debt left after this tx. */
  debtRemain: bigint;
  /** Whether a rewards proof will be submitted (rewards pulled in). */
  includesRewards: boolean;
  /** Whether the operator has any splitter recipients configured. */
  hasSplits: boolean;
  /** Whether the user explicitly redirects rewards to bond (no RA payout). */
  isRewardsToBond: boolean;
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
export const useClaimBreakdown = (): ClaimBreakdown => {
  const { bond, rewards, poolData, feeSplits } = useClaimBondFormData(true);
  const [token, amount, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimOption']
  >({ name: ['token', 'amount', 'claimOption'] });

  const isRewardsToBond = claimOption === CLAIM_OPTION.REWARDS_TO_BOND;
  const includesRewards = claimOption !== CLAIM_OPTION.BOND_TO_RA;
  const hasSplits = feeSplits.length > 0;
  const totalShare = feeSplits.reduce((sum, s) => sum + s.share, 0n);

  const distributed = includesRewards ? rewards.available : 0n;

  const claimablePre = bigMax(
    0n,
    bond.current - bond.required - bond.locked - bond.debt,
  );
  const claimable = bigMax(
    0n,
    bond.current + distributed - bond.required - bond.locked,
  );
  const coverAmount = distributed - (claimable - claimablePre);

  const splittableGross = hasSplits
    ? bigMin(claimable, bond.pendingToSplit + distributed)
    : 0n;
  const splittable = (splittableGross * totalShare) / PERCENT_BASIS;

  const userClaimSteth = isRewardsToBond
    ? 0n
    : token === TOKENS.wsteth
      ? convertSharesToEth(amount ?? 0n, poolData)
      : (amount ?? 0n);

  const toRA = bigMin(userClaimSteth, claimable - splittable);

  const bondDelta = claimable - claimablePre - splittable - toRA;

  const debtBurned = bigMin(bond.debt, bond.current + distributed);
  const debtRemain = bond.debt - debtBurned;

  return {
    coverAmount,
    splittableGross,
    splittable,
    toRA,
    bondDelta,
    debtBurned,
    debtRemain,
    includesRewards,
    hasSplits,
    isRewardsToBond,
  };
};
