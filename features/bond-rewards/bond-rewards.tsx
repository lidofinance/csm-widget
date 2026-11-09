import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { BondStatsCard } from 'shared/components';
import { BondRewardsActions } from './bond-rewards-actions';
import { NewValidatorHeader } from './new-validator-header';
import { RewardsHistoryCard } from './rewards-history';

export const BondRewards: FC = () => (
  <Stack direction="column" gap={24}>
    <BondStatsCard
      header={<NewValidatorHeader />}
      actions={<BondRewardsActions />}
    />
    <RewardsHistoryCard />
  </Stack>
);
