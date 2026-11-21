import { IconArrowRight } from '@lidofinance/lido-app-ui';
import { ReactNode } from 'react';
import { CLAIM_OPTION } from '../context';
import s from '../styles.module.css';

import BondIcon from 'assets/balance/bond.svg?react';
import RewardsIcon from 'assets/balance/rewards.svg?react';

const RewardsAddressChip = () => (
  <span className={s.rewardsAddressChip}>R</span>
);

export const CLAIM_OPTION_ICONS: Record<CLAIM_OPTION, ReactNode> = {
  [CLAIM_OPTION.ALL_TO_RA]: (
    <span className={s.claimOptionIcons} aria-hidden>
      <BondIcon />
      <RewardsIcon />
      <IconArrowRight />
      <RewardsAddressChip />
    </span>
  ),
  [CLAIM_OPTION.REWARDS_TO_BOND]: (
    <span className={s.claimOptionIcons} aria-hidden>
      <RewardsIcon />
      <IconArrowRight />
      <BondIcon />
    </span>
  ),
  [CLAIM_OPTION.BOND_TO_RA]: (
    <span className={s.claimOptionIcons} aria-hidden>
      <BondIcon />
      <IconArrowRight />
      <RewardsAddressChip />
    </span>
  ),
};
