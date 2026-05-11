import {
  convertEthToShares,
  convertSharesToEth,
  PERCENT_BASIS,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import { bigMax, bigMin } from 'utils';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  ClaimBondFormNetworkData,
  useClaimBondFormData,
} from '../context';

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
  /** Token chosen by the operator for the claim payout. */
  token: TOKENS;
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

type BreakdownInput = Pick<
  ClaimBondFormInputType,
  'token' | 'amount' | 'claimOption'
>;

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
  { token, amount, claimOption }: BreakdownInput,
  data: ClaimBondFormNetworkData,
): ClaimBreakdown => {
  const {
    bond,
    rewards,
    poolData,
    feeSplits,
    calculation: { totalShare },
  } = data;

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
  // Of `debtBurned`, the portion attributable to fresh rewards is bounded by
  // `distributed`; the rest came from pre-existing bond. `coverAmount` is what
  // remains of the absorbed rewards after subtracting that — i.e. the portion
  // that filled forKeys + locked deficit.
  const debtCoveredFromRewards = bigMin(distributed, debtBurned);
  const coverAmount = bigMax(0n, totalAbsorbed - debtCoveredFromRewards);

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
  // The contract pays the Rewards Address in the chosen token: stETH/ETH go
  // out 1:1 (ETH via withdrawal NFT), wstETH is the share-equivalent of
  // `toRA`. Mirrors the conversion in `userClaimSteth`.
  const toRAToken =
    token === TOKENS.wsteth ? convertEthToShares(toRA, poolData) : toRA;

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

export const useClaimBreakdown = (): ClaimBreakdown => {
  const data = useClaimBondFormData(true);
  const [token, amount, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimOption']
  >({ name: ['token', 'amount', 'claimOption'] });

  return computeClaimBreakdown({ token, amount, claimOption }, data);
};
