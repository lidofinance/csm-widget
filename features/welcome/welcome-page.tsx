import { FC } from 'react';

import { Layout } from 'shared/components';
import { Welcome } from './welcome';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { TryCSM } from './try-csm';

export const WelcomePage: FC = () => {
  return (
    <Layout matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageWelcome}>
      <Welcome />
      <TryCSM />
    </Layout>
  );
};
