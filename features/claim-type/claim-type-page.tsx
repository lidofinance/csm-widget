import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { ClaimType } from './claim-type';

export const ClaimTypePage: FC = () => (
  <Layout
    title="Change Node Operator type"
    subtitle="Identified Community Stakers"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageClaimType}
  >
    <ClaimType />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
