import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { BondRewards } from './bond-rewards';

export const BondRewardsPage: FC = () => (
  <Layout
    wide
    pageName="BondRewards"
    breadcrumbs={[{ label: 'Bond & Rewards' }]}
  >
    <BondPageSwitcher />
    <BondRewards />
  </Layout>
);
