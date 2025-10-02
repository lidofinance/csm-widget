import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { AddBond } from './add-bond';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq } from 'shared/components';
import { FAQ_BOND } from 'faq';

export const AddBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Add bond to your Bond balance"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageAddBond}
  >
    <BondPageSwitcher />
    <AddBond />
    <Faq items={FAQ_BOND} />
  </Layout>
);
