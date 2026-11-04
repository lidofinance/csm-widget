import type { BondBalance } from '@lidofinance/lido-csm-sdk';
import { STETH_ROUNDING_THRESHOLD, TOKENS } from '@lidofinance/lido-csm-sdk';
import { CLAIM_OPTION, type ClaimBondCalculation } from './context/types';

type Meta = { label: string; description: string };

const COMPENSATE_AND_CLAIM_REWARDS: Meta = {
  label: 'Rewards → Rewards Address',
  description: 'Compensate the Insufficient Bond and claim Rewards',
};

const CLAIM_ALL: Meta = {
  label: 'All → Rewards Address',
  description: 'Claim both Excess Bond and Rewards',
};

const CLAIM_EXCESS_BOND: Meta = {
  label: 'Excess Bond → Rewards Address',
  description: 'Claim only Excess Bond. Rewards remain unclaimed.',
};

const CLAIM_EXCESS_BOND_WITH_PENDING_SPLIT: Meta = {
  label: CLAIM_EXCESS_BOND.label,
  description:
    'Claim Excess Bond. Pending splitter share will be settled from bond.',
};

const COMPENSATE_INSUFFICIENT: Meta = {
  label: 'Rewards → Bond',
  description: 'Compensate the Insufficient Bond',
};

const REWARDS_TO_EXCESS_BOND: Meta = {
  label: 'Rewards → Excess Bond',
  description: 'Move all rewards to the bond. Best for uploading more keys.',
};

const SPLIT_REWARDS_ONLY: Meta = {
  label: 'Rewards → Splitter addresses',
  description: 'Split rewards',
};

const SPLIT_AND_CLAIM_BOND: Meta = {
  label: 'Rewards → Splitter addresses, Excess Bond → Rewards Address',
  description: 'Split rewards and claim Excess bond',
};

const SPLIT_AND_COMPENSATE_TO_RA: Meta = {
  label: 'Rewards → Splitter addresses → Rewards Address',
  description: 'Split rewards, send remaining to Rewards Address',
};

const SPLIT_REWARDS_TO_BOND: Meta = {
  label: 'Rewards → Splitter addresses → Excess bond',
  description: 'Split rewards, send remaining to Excess bond',
};

export type ClaimOptionContext = {
  keysInsufficient: bigint;
  realExcess: bigint;
  rewardsRemainder: bigint;
  hasSplits: boolean;
  hasPendingToSplit: boolean;
};

export const getClaimOptionContext = ({
  calculation: { keysInsufficient, realExcess, rewardsRemainder },
  bond,
  feeSplits,
}: {
  calculation: Pick<
    ClaimBondCalculation,
    'keysInsufficient' | 'realExcess' | 'rewardsRemainder'
  >;
  bond: Pick<BondBalance, 'pendingToSplit'>;
  feeSplits: unknown[];
}): ClaimOptionContext => ({
  keysInsufficient,
  realExcess,
  rewardsRemainder,
  hasSplits: feeSplits.length > 0,
  hasPendingToSplit: bond.pendingToSplit > 0n,
});

export type ClaimOptionDescriptor = Meta & { submitLabel: string };

const claimSubmit = (token: TOKENS) =>
  token === TOKENS.eth ? 'Request withdrawal' : 'Claim';

const rewardsToBondSubmit = (rewardsRemainder: bigint) =>
  rewardsRemainder === 0n ? 'Compensate' : 'Claim rewards to the Bond balance';

export const describeClaimOption = (
  option: CLAIM_OPTION,
  {
    keysInsufficient,
    realExcess,
    rewardsRemainder,
    hasSplits,
    hasPendingToSplit,
  }: ClaimOptionContext,
  token: TOKENS,
): ClaimOptionDescriptor => {
  // Only the forKeys deficit gets "Insufficient Bond" wording; locked/debt
  // also absorb rewards, but the operator doesn't see them as insufficient.
  const isKeysInsufficient = keysInsufficient > STETH_ROUNDING_THRESHOLD;

  switch (option) {
    case CLAIM_OPTION.ALL_TO_RA: {
      if (isKeysInsufficient && rewardsRemainder > 0n) {
        return {
          ...(hasSplits
            ? SPLIT_AND_COMPENSATE_TO_RA
            : COMPENSATE_AND_CLAIM_REWARDS),
          submitLabel: claimSubmit(token),
        };
      }
      if (hasSplits && realExcess === 0n) {
        return { ...SPLIT_REWARDS_ONLY, submitLabel: claimSubmit(token) };
      }
      return {
        ...(hasSplits ? SPLIT_AND_CLAIM_BOND : CLAIM_ALL),
        submitLabel: claimSubmit(token),
      };
    }

    case CLAIM_OPTION.BOND_TO_RA:
      return {
        ...(hasSplits && hasPendingToSplit
          ? CLAIM_EXCESS_BOND_WITH_PENDING_SPLIT
          : CLAIM_EXCESS_BOND),
        submitLabel: claimSubmit(token),
      };

    case CLAIM_OPTION.REWARDS_TO_BOND: {
      // Rewards that don't cover the insufficient bond are all spent on it, so
      // the compensation copy wins even with splitters configured.
      if (isKeysInsufficient && rewardsRemainder === 0n) {
        return {
          ...COMPENSATE_INSUFFICIENT,
          submitLabel: rewardsToBondSubmit(rewardsRemainder),
        };
      }
      if (hasSplits) {
        return {
          ...SPLIT_REWARDS_TO_BOND,
          submitLabel: rewardsToBondSubmit(rewardsRemainder),
        };
      }
      if (isKeysInsufficient) {
        return {
          ...COMPENSATE_INSUFFICIENT,
          submitLabel: rewardsToBondSubmit(rewardsRemainder),
        };
      }
      return {
        ...REWARDS_TO_EXCESS_BOND,
        submitLabel: 'Claim rewards to the Bond balance',
      };
    }
  }
};

export const CLAIM_OPTION_ORDER: readonly CLAIM_OPTION[] = [
  CLAIM_OPTION.ALL_TO_RA,
  CLAIM_OPTION.BOND_TO_RA,
  CLAIM_OPTION.REWARDS_TO_BOND,
];

export type ClaimOptionView = {
  option: CLAIM_OPTION;
  label: string;
  description: string;
  disabled: boolean;
};

export const getClaimOptionViews = (
  availableOptions: readonly CLAIM_OPTION[],
  ctx: ClaimOptionContext,
  token: TOKENS,
): ClaimOptionView[] =>
  CLAIM_OPTION_ORDER.map((option) => {
    const { label, description } = describeClaimOption(option, ctx, token);
    return {
      option,
      label,
      description,
      disabled: !availableOptions.includes(option),
    };
  }).sort((a, b) => Number(a.disabled) - Number(b.disabled));
