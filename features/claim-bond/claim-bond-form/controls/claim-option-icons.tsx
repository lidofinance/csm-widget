import { IconArrowRight } from '@lidofinance/lido-app-ui';
import { ReactNode } from 'react';
import { CLAIM_OPTION } from '../context';
import { ClaimOptionIconsStyle, RewardsAddressChipStyle } from '../styles';

import BondIcon from 'assets/balance/bond.svg?react';
import RewardsIcon from 'assets/balance/rewards.svg?react';

const RewardsAddressChip = () => (
  <RewardsAddressChipStyle>R</RewardsAddressChipStyle>
);

export const CLAIM_OPTION_ICONS: Record<CLAIM_OPTION, ReactNode> = {
  [CLAIM_OPTION.ALL_TO_RA]: (
    <ClaimOptionIconsStyle aria-hidden>
      <BondIcon />
      <RewardsIcon />
      <IconArrowRight />
      <RewardsAddressChip />
    </ClaimOptionIconsStyle>
  ),
  [CLAIM_OPTION.REWARDS_TO_BOND]: (
    <ClaimOptionIconsStyle aria-hidden>
      <RewardsIcon />
      <IconArrowRight />
      <BondIcon />
    </ClaimOptionIconsStyle>
  ),
  [CLAIM_OPTION.BOND_TO_RA]: (
    <ClaimOptionIconsStyle aria-hidden>
      <BondIcon />
      <IconArrowRight />
      <RewardsAddressChip />
    </ClaimOptionIconsStyle>
  ),
};
