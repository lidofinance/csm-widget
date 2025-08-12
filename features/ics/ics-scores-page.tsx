import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { IcsScores } from './ics-scores';
import { TypePageSwitcher } from 'shared/navigate';
import { Faq } from 'shared/components';
import { FAQ_OPERATOR_TYPE } from 'faq';

export const IcsScoresPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Stakers"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs}
  >
    <TypePageSwitcher />
    <IcsScores />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
