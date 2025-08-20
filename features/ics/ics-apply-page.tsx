import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { IcsApply } from './ics-apply';

export const IcsApplyPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs}
  >
    <TypePageSwitcher />
    <IcsApply />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
