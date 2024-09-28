import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/components';
import { NormalizeQueue } from './normalize-queue';

export const NormalizeQueuePage: FC = () => (
  <Layout
    title="Normalize queue"
    subtitle="Put keys to deposit queue"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageNormalizeQueue}
  >
    <NormalizeQueue />
  </Layout>
);
