import { Grid, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import {
  CsmHero,
  OptionsCard,
  SimpleStakingCard,
  TryOtherNetworkCard,
  useCsmStats,
} from './community-staking';

export const CommunityStakingPage: FC = () => {
  const { aprs, maxApr, capital, operators } = useCsmStats();

  return (
    <Layout wide title="Community Staking" pageName="CommunityStaking">
      <Stack direction="column" gap={8} align="stretch">
        <CsmHero maxApr={maxApr} capital={capital} operators={operators} />
        <Grid columns={{ base: 2, md: 1 }} gap={8}>
          <OptionsCard aprs={aprs} />
          <SimpleStakingCard />
        </Grid>
        <TryOtherNetworkCard />
      </Stack>
    </Layout>
  );
};
