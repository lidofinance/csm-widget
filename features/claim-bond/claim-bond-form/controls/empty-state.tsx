import { Card, Description, H3 } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { EmptyStateStyle } from '../styles';

import RewardsIcon from 'assets/balance/empty.svg?react';

export const EmptyState: FC = () => (
  <Card dataTestId={{ root: 'claimEmptyState' }}>
    <EmptyStateStyle>
      <RewardsIcon />
      <H3>Nothing to claim at the moment</H3>
      <Description>
        Once rewards and excess bond increase,
        <br />
        you&apos;ll be able to claim them there
      </Description>
    </EmptyStateStyle>
  </Card>
);
