import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { RewardsHistory } from './rewards-history';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';

export const RewardsHistoryPage: FC = () => (
  <Layout
    title="Rewards history"
    subtitle="View your rewards history"
    pageName="RewardsHistory"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Rewards history' },
    ]}
  >
    <BondPageSwitcher />
    <RewardsHistory />
    <Faq items={useFaq('BOND')} />
  </Layout>
);
