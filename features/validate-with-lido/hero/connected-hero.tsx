import { Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { CsmJoinButtons, PromoCard, SecondaryText } from '../components';

export const ConnectedHero: FC = () => (
  <PromoCard $radius="xl">
    <Stack direction="column" gap={24}>
      <Stack direction="column" gap={8}>
        <Typography variant="h1" as="h2">
          You don’t have any operators yet
        </Typography>
        <div>
          <SecondaryText variant="bodyLarge">
            Your connected wallet isn’t managing any Node Operators yet. Get
            started by joining one of Lido’s staking modules.
          </SecondaryText>
          <SecondaryText variant="bodyLarge">
            Community Staking Module is the easiest way to begin.
          </SecondaryText>
        </div>
      </Stack>
      <Stack direction="row" gap={12} wrap>
        <CsmJoinButtons size="big" joinTestId="heroJoinCsmBtn" />
      </Stack>
    </Stack>
  </PromoCard>
);
