import { ReactNode } from 'react';

import { ReactComponent as _BondIcon } from 'assets/balance/bond.svg';
import { ReactComponent as _RewardsIcon } from 'assets/balance/rewards.svg';
import styled, { css } from 'styled-components';
import { CLAIM_OPTION, ClaimBondFormNetworkData } from '../context';

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

type Data = Pick<ClaimBondFormNetworkData, 'bond' | 'rewards'>;

type ClaimOptionMeta = {
  label: ReactNode;
  description: ReactNode;
};

const COMPENSATE_ALL_FROM_REWARDS: ClaimOptionMeta = {
  label: (
    <>
      <RewardsIcon /> Rewards → <BondIcon /> Bond
    </>
  ),
  description: 'All Rewards will compensate the Insufficient Bond',
};

const COMPENSATE_AND_CLAIM_REWARDS: ClaimOptionMeta = {
  label: (
    <>
      <BondIcon /> <RewardsIcon /> Rewards → Rewards Address
    </>
  ),
  description: 'Compensate the Insufficient Bond and claim Rewards',
};

const CLAIM_REWARDS_ONLY: ClaimOptionMeta = {
  label: (
    <>
      <BondIcon /> <RewardsIcon /> Rewards → Rewards Address
    </>
  ),
  description: 'Claim Rewards',
};

const CLAIM_ALL: ClaimOptionMeta = {
  label: (
    <>
      <BondIcon /> <RewardsIcon /> All → Rewards Address
    </>
  ),
  description: 'Claim both Excess Bond and Rewards',
};

const CLAIM_EXCESS_BOND: ClaimOptionMeta = {
  label: (
    <>
      <BondIcon />
      Excess Bond → Rewards Address
    </>
  ),
  description: 'Claim only Excess Bond. Rewards remain unclaimed',
};

const COMPENSATE_INSUFFICIENT: ClaimOptionMeta = {
  label: (
    <>
      <RewardsIcon /> Rewards → <BondIcon /> Bond
    </>
  ),
  description: 'Compensate the Insufficient Bond',
};

const REWARDS_TO_EXCESS_BOND: ClaimOptionMeta = {
  label: (
    <>
      <RewardsIcon /> Rewards → <BondIcon /> Excess Bond
    </>
  ),
  description: 'Move all rewards to the bond. Best for uploading more keys',
};

export const getClaimOption = (
  option: CLAIM_OPTION,
  { bond, rewards }: Data,
): ClaimOptionMeta => {
  switch (option) {
    case CLAIM_OPTION.ALL_TO_RA:
      if (bond.isInsufficient) {
        return bond.delta >= rewards.available
          ? COMPENSATE_ALL_FROM_REWARDS
          : COMPENSATE_AND_CLAIM_REWARDS;
      }
      return bond.delta ? CLAIM_ALL : CLAIM_REWARDS_ONLY;

    case CLAIM_OPTION.BOND_TO_RA:
      return CLAIM_EXCESS_BOND;

    case CLAIM_OPTION.REWARDS_TO_BOND:
      return bond.isInsufficient
        ? COMPENSATE_INSUFFICIENT
        : REWARDS_TO_EXCESS_BOND;
  }
};
