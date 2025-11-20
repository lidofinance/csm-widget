import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { RewardsHistory } from './rewards-history';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq } from 'shared/components';
import { FAQ_BOND } from 'faq';

export const RewardsHistoryPage: FC = () => (
  <Layout
    title="Rewards history"
    subtitle="Claim Bond & Rewards to the Rewards address"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageRewardsHistory}
  >
    <BondPageSwitcher />
    <RewardsHistory />
    <Faq items={FAQ_BOND} />
  </Layout>
);
