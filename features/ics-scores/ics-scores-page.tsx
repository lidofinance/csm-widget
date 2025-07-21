import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { IcsScores } from './ics-scores';

export const IcsScoresPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Stakers"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs}
  >
    <IcsScores />
  </Layout>
);
