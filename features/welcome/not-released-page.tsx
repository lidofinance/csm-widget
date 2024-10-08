import { FC } from 'react';

import { Layout } from 'shared/components';
import { NotReleasedBanner } from './not-released-banner';
import { WelcomeSection } from './welcome-section';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TryCSM } from './try-csm';

export const NotReleasedPage: FC = () => {
  return (
    <Layout
      dummy={true}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageNotReleased}
    >
      <NotReleasedBanner />
      <WelcomeSection />
      <TryCSM />
    </Layout>
  );
};
