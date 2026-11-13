import { Card, EmptyState as AppEmptyState } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import RewardsIcon from 'assets/balance/empty.svg?react';

export const EmptyState: FC = () => (
  <Card dataTestId={{ root: 'claimEmptyState' }}>
    <AppEmptyState
      illustration={<RewardsIcon />}
      title="Nothing to claim at the moment"
      description={
        <>
          Once rewards and excess bond increase,
          <br />
          you&apos;ll be able to claim them there
        </>
      }
    />
  </Card>
);
