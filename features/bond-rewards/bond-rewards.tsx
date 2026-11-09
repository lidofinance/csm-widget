import { FC } from 'react';
import { BondStatsCard } from 'shared/components';
import { BondRewardsActions } from './bond-rewards-actions';
import { NewValidatorHeader } from './new-validator-header';

export const BondRewards: FC = () => (
  <BondStatsCard
    header={<NewValidatorHeader />}
    actions={<BondRewardsActions />}
  />
);
