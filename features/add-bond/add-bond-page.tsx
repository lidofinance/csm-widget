import { FC } from 'react';

import { Layout } from 'shared/components';
import { BondPageSwitcher } from 'shared/navigate';
import { AddBond } from './add-bond';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const AddBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Add bond to your Bond balance"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageAddBond}
  >
    <BondPageSwitcher />
    <AddBond />
  </Layout>
);
