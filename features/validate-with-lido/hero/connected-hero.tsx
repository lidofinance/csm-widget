import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { CsmJoinButtons } from '../components';
import { HeroCard, HeroText } from './hero-card';

export const ConnectedHero: FC = () => (
  <HeroCard
    variant="fill"
    title="Become a Node Operator"
    text={
      <HeroText>
        You don’t have any Node Operators yet. Start running validators easily
        through Lido&apos;s staking modules. We highly recommend the Community
        Staking Module (CSM) — it is permissionless, requires no whitelist, has
        a low bond requirement, and is the perfect starting point for solo
        stakers.
      </HeroText>
    }
    actions={
      <Stack direction="row" gap={12} wrap>
        <CsmJoinButtons
          size="big"
          joinLabel="Get Started with CSM"
          joinTestId="heroJoinCsmBtn"
        />
      </Stack>
    }
  />
);
