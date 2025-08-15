import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { ClaimType } from './claim-type';
import { TypePageSwitcher } from 'shared/navigate';

export const ClaimTypePage: FC = () => (
  <Layout
    title="Apply for Identified Independent Stakers List"
    subtitle="Get verified as an Independent Staker"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageClaimType}
  >
    <TypePageSwitcher />
    <ClaimType />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
