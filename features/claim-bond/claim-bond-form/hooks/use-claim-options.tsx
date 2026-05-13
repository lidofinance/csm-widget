import { ReactNode } from 'react';
import { BondBalance, FeeSplit, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useWatch } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { ReactComponent as _BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as _RewardsIcon } from 'assets/balance/rewards.svg';

import {
  CLAIM_OPTION,
  ClaimBondCalculation,
  ClaimBondFormInputType,
  useClaimBondFormData,
} from '../context';

const iconStyle = css`
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  vertical-align: bottom;
  padding-right: 4px;

  &:has(+ svg) {
    padding-right: 0;
  }
`;

const BondIcon = styled(_BondIcon)`
  ${iconStyle}
`;
const RewardsIcon = styled(_RewardsIcon)`
  ${iconStyle}
`;

type Meta = { label: ReactNode; description: ReactNode };

const COMPENSATE_AND_CLAIM_REWARDS: Meta = {
  label: (
    <>
      <RewardsIcon /> <BondIcon /> Rewards → Rewards Address
    </>
  ),
  description: 'Compensate the Insufficient Bond and claim Rewards',
};

const CLAIM_ALL: Meta = {
  label: (
    <>
      <RewardsIcon /> <BondIcon /> All → Rewards Address
    </>
  ),
  description: 'Claim both Excess Bond and Rewards',
};

const CLAIM_EXCESS_BOND: Meta = {
  label: (
    <>
      <BondIcon />
      Excess Bond → Rewards Address
    </>
  ),
  description: 'Claim only Excess Bond. Rewards remain unclaimed',
};

const CLAIM_EXCESS_BOND_WITH_PENDING_SPLIT: Meta = {
  label: CLAIM_EXCESS_BOND.label,
  description:
    'Claim Excess Bond. Pending splitter share will be settled from bond.',
};

const COMPENSATE_INSUFFICIENT: Meta = {
  label: (
    <>
      <RewardsIcon /> Rewards → <BondIcon /> Bond
    </>
  ),
  description: 'Compensate the Insufficient Bond',
};

const REWARDS_TO_EXCESS_BOND: Meta = {
  label: (
    <>
      <RewardsIcon /> Rewards → <BondIcon /> Excess Bond
    </>
  ),
  description: 'Move all rewards to the bond. Best for uploading more keys',
};

const SPLIT_REWARDS_ONLY: Meta = {
  label: (
    <>
      <RewardsIcon /> Rewards → Splitter addresses
    </>
  ),
  description: 'Split rewards',
};

const SPLIT_AND_CLAIM_BOND: Meta = {
  label: (
    <>
      <RewardsIcon /> Rewards → Splitter addresses,
      <br />
      <BondIcon /> Excess Bond → Rewards Address
    </>
  ),
  description: 'Split rewards and claim Excess bond',
};

const SPLIT_AND_COMPENSATE_TO_RA: Meta = {
  label: (
    <>
      <RewardsIcon /> Rewards → Splitter addresses → Rewards Address
    </>
  ),
  description: 'Split rewards, send remaining to Rewards Address',
};

const SPLIT_REWARDS_TO_BOND: Meta = {
  label: (
    <>
      <RewardsIcon /> <BondIcon /> Rewards → Splitter addresses → Excess bond
    </>
  ),
  description: 'Split rewards, send remaining to Excess bond',
};

type Ctx = ClaimBondCalculation & {
  feeSplits: FeeSplit[];
  bond: BondBalance;
};

type Descriptor = Meta & { submitLabel: string };

const claimSubmit = (token: TOKENS) =>
  token === TOKENS.eth ? 'Request withdrawal' : 'Claim';

const rewardsToBondSubmit = (rewardsRemainder: bigint) =>
  rewardsRemainder === 0n ? 'Compensate' : 'Claim rewards to the Bond balance';

const describe = (
  option: CLAIM_OPTION,
  ctx: Ctx,
  token: TOKENS,
): Descriptor => {
  const { keysInsufficient, realExcess, rewardsRemainder, feeSplits, bond } =
    ctx;

  const hasSplits = feeSplits.length > 0;
  const hasPendingToSplit = bond.pendingToSplit > 0n;
  // Only forKeys-deficit triggers "Compensate Insufficient Bond" wording.
  // Locked/debt absorb rewards into bond too, but the operator does not see
  // "Insufficient bond" in sources-info, so the Claim variants are used and
  // the breakdown panel reflects the actual on-chain effect.
  const isKeysInsufficient = keysInsufficient > 0n;

  switch (option) {
    case CLAIM_OPTION.ALL_TO_RA: {
      // "Compensate + claim Rewards" only when rewards actually survive the
      // insufficient-bond top-up. Otherwise ALL_TO_RA falls through to a basic
      // CLAIM_ALL ("All → Rewards Address") that conveys the option's intent
      // regardless of how much actually reaches RA — keeps the label distinct
      // from REWARDS_TO_BOND when the option is disabled.
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

const ORDER: readonly CLAIM_OPTION[] = [
  CLAIM_OPTION.ALL_TO_RA,
  CLAIM_OPTION.BOND_TO_RA,
  CLAIM_OPTION.REWARDS_TO_BOND,
];

export type ClaimOptionView = {
  option: CLAIM_OPTION;
  label: ReactNode;
  description: ReactNode;
  disabled: boolean;
};

export type ClaimOptions = {
  options: ClaimOptionView[];
  submitLabel: string;
};

export const useClaimOptions = (): ClaimOptions => {
  const { bond, feeSplits, calculation, availableOptions } =
    useClaimBondFormData(true);
  const [token, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimOption']
  >({ name: ['token', 'claimOption'] });

  const ctx: Ctx = {
    ...calculation,
    feeSplits,
    bond,
  };

  const options: ClaimOptionView[] = ORDER.map((option) => {
    const { label, description } = describe(option, ctx, token);
    return {
      option,
      label,
      description,
      disabled: availableOptions.indexOf(option) < 0,
    };
  }).sort((a, b) => Number(a.disabled) - Number(b.disabled));

  const { submitLabel } = describe(claimOption, ctx, token);

  return { options, submitLabel };
};
