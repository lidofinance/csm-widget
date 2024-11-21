import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { ClaimBond } from './claim-bond';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const ClaimBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Claim Bond to the Rewards Address"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageClaimBond}
  >
    <BondPageSwitcher />
    <ClaimBond />
  </Layout>
);
