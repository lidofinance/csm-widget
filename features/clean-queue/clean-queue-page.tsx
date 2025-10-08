import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Layout } from 'shared/layout';
import { CleanQueue } from './clean-queue';

export const CleanQueuePage: FC = () => (
  <Layout
    title="Clean queue"
    subtitle="Remove empty batches from deposit queue"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageCleanQueue}
  >
    <CleanQueue />
  </Layout>
);
