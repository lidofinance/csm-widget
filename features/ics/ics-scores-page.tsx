import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { Faq } from 'shared/components';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { BlockStyle } from './score-system/styles';
import { ApplicationFlow, Introduction, ScoreSources } from './score-system';

export const IcsScoresPage: FC = () => (
  <Layout
    // dummy
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Stakers"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs}
  >
    <TypePageSwitcher />
    <BlockStyle>
      <Introduction />
      <ScoreSources />
      <ApplicationFlow />
    </BlockStyle>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
