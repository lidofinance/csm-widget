import { FC } from 'react';

import { Layout } from 'shared/layout';
import { ClaimType } from './claim-type';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const ClaimTypePage: FC = () => (
  <Layout
    title="Change Node Operator type"
    subtitle="Identified Community Stakers"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageClaimType}
  >
    <ClaimType />
  </Layout>
);
