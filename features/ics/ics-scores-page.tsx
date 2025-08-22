import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { BlockStyle } from './score-system/styles';
import { ApplicationFlow, Introduction, ScoreSources } from './score-system';
import { RoundBanner } from './round-banner';

export const IcsScoresPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs}
  >
    <TypePageSwitcher />
    <RoundBanner />
    <BlockStyle>
      <Introduction />
      <ScoreSources />
      <ApplicationFlow />
    </BlockStyle>
  </Layout>
);
