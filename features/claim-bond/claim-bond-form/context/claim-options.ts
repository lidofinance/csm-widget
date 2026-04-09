import { BondBalance, Rewards } from '@lidofinance/lido-csm-sdk';
import { CLAIM_OPTION, ClaimOption } from './types';

// ---------------------------------------------------------------------------
// Option behavior helpers
// ---------------------------------------------------------------------------

/** Whether the SDK call should include the rewards merkle proof */
export const optionIncludesRewards = (option: ClaimOption) =>
  option !== CLAIM_OPTION.BOND_TO_RA;

/**
 * MaxValues index: 0 = bond-only, 1 = bond+rewards.
 * BOND_TO_RA uses bond-only max; everything else uses bond+rewards.
 */
export const optionMaxValueIndex = (option: ClaimOption): 0 | 1 =>
  option === CLAIM_OPTION.BOND_TO_RA ? 0 : 1;

/** Whether the token select + amount input sections should be visible */
export const optionShowsTokenAmount = (option: ClaimOption) =>
  option !== CLAIM_OPTION.REWARDS_TO_BOND && option !== CLAIM_OPTION.COMPENSATE;

// ---------------------------------------------------------------------------
// Option set definitions
// ---------------------------------------------------------------------------

export type OptionEntry = {
  value: ClaimOption;
  disabled?: boolean;
};

export type OptionSet = {
  options: OptionEntry[];
  defaultOption: ClaimOption;
};

/** Set A — Standard: has excess + has rewards */
const SET_A: OptionSet = {
  defaultOption: CLAIM_OPTION.ALL_TO_RA,
  options: [
    { value: CLAIM_OPTION.ALL_TO_RA },
    { value: CLAIM_OPTION.BOND_TO_RA },
    { value: CLAIM_OPTION.REWARDS_TO_BOND },
  ],
};

/** Set B — No excess: excess = 0, has rewards */
const SET_B: OptionSet = {
  defaultOption: CLAIM_OPTION.REWARDS_TO_RA,
  options: [
    { value: CLAIM_OPTION.REWARDS_TO_RA },
    { value: CLAIM_OPTION.REWARDS_TO_BOND },
    { value: CLAIM_OPTION.BOND_TO_RA, disabled: true },
  ],
};

/** Set C — Insufficient bond: rewards > debt */
const SET_C: OptionSet = {
  defaultOption: CLAIM_OPTION.REWARDS_TO_RA,
  options: [
    { value: CLAIM_OPTION.REWARDS_TO_RA },
    { value: CLAIM_OPTION.REWARDS_TO_BOND },
    { value: CLAIM_OPTION.BOND_TO_RA, disabled: true },
  ],
};

/** Set D — Insufficient bond: rewards ≤ debt (compensate only) */
const SET_D: OptionSet = {
  defaultOption: CLAIM_OPTION.COMPENSATE,
  options: [
    { value: CLAIM_OPTION.COMPENSATE },
    { value: CLAIM_OPTION.ALL_TO_RA, disabled: true },
    { value: CLAIM_OPTION.BOND_TO_RA, disabled: true },
  ],
};

// ---------------------------------------------------------------------------
// Option set selection
// ---------------------------------------------------------------------------

type SelectionInput = {
  bond: BondBalance;
  rewards: Rewards;
};

export const getOptionSet = ({ bond, rewards }: SelectionInput): OptionSet => {
  const hasRewards = rewards.available > 0n;
  const hasExcess = !bond.isInsufficient && bond.delta > 0n;

  if (bond.isInsufficient) {
    if (hasRewards && rewards.available > bond.delta) {
      return SET_C;
    }
    return SET_D;
  }

  if (!hasExcess) {
    return SET_B;
  }

  return SET_A;
};

// ---------------------------------------------------------------------------
// Option labels and descriptions
// ---------------------------------------------------------------------------

type OptionMeta = {
  label: string;
  description: string;
  icons: ('bond' | 'reward')[];
};

const OPTION_META: Record<string, OptionMeta> = {
  [CLAIM_OPTION.ALL_TO_RA]: {
    label: 'All \u2192 Rewards Address',
    description: 'Claim both Excess Bond and Rewards',
    icons: ['bond', 'reward'],
  },
  [CLAIM_OPTION.BOND_TO_RA]: {
    label: 'Excess Bond \u2192 Rewards Address',
    description: 'Claim only Excess Bond. Rewards remain unclaimed',
    icons: ['bond'],
  },
  [CLAIM_OPTION.REWARDS_TO_BOND]: {
    label: 'Rewards \u2192 Excess Bond',
    description: 'Move all rewards to the bond. Best for uploading more keys',
    icons: ['reward'],
  },
  [CLAIM_OPTION.REWARDS_TO_RA]: {
    label: 'Rewards \u2192 Rewards Address',
    description: 'Claim Rewards',
    icons: ['reward'],
  },
  [CLAIM_OPTION.COMPENSATE]: {
    label: 'Rewards \u2192 Bond',
    description: 'Compensate the Insufficient Bond',
    icons: ['reward'],
  },
};

/** Get option metadata, with overrides for insufficient bond context */
export const getOptionMeta = (
  option: ClaimOption,
  bond: BondBalance,
): OptionMeta => {
  const base = OPTION_META[option];

  // Set C: insufficient with rewards > debt — first option has different text
  if (option === CLAIM_OPTION.REWARDS_TO_RA && bond.isInsufficient) {
    return {
      label: 'Rewards \u2192 Rewards Address',
      description: 'Compensate the Insufficient Bond and claim Rewards',
      icons: ['bond', 'reward'],
    };
  }

  // Set C: "Rewards → Bond" label differs from Set A
  if (option === CLAIM_OPTION.REWARDS_TO_BOND && bond.isInsufficient) {
    return {
      label: 'Rewards \u2192 Bond',
      description: 'Move all rewards to the bond. Best for uploading more keys',
      icons: ['reward'],
    };
  }

  return base;
};
