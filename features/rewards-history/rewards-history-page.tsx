import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { RewardsHistory } from './rewards-history';
import { Faq } from 'shared/components';
import { FAQ_BOND } from 'faq';

export const RewardsHistoryPage: FC = () => (
  <Layout
    title="Rewards history"
    subtitle="View your rewards history"
    pageName="RewardsHistory"
  >
    <BondPageSwitcher />
    <RewardsHistory />
    <Faq items={FAQ_BOND} />
  </Layout>
);
