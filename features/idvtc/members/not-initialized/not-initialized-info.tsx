import { Body, Card, Description, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export const NotInitializedInfo: FC = () => (
  <Card data-testid="notInitializedInfo">
    <Stack gap={8}>
      <Body weight="semibold">Members have not been initialized yet</Body>
      <Description color="secondary">
        The Manager or Rewards Address of this operator needs to initialize the
        cluster members
      </Description>
    </Stack>
  </Card>
);
