import { FC } from 'react';

import { Layout } from 'shared/components';
import { BondPageSwitcher } from 'shared/navigate';
import { ClaimRewards } from './claim-rewards';

export const ClaimRewardsPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Claim Bond & Rewards to the Rewards address"
  >
    <BondPageSwitcher />
    <ClaimRewards />
  </Layout>
);
