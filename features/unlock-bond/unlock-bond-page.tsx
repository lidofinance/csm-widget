import { FC } from 'react';

import { Layout } from 'shared/components';
import { BondPageSwitcher } from 'shared/navigate';
import { UnlockBond } from './unlock-bond';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const UnlockBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Cover locked bond"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageUnlockBond}
  >
    <BondPageSwitcher />
    <UnlockBond />
  </Layout>
);
