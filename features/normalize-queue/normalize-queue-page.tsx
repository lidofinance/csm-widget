import { FC } from 'react';

import { Layout } from 'shared/layout';
import { NormalizeQueue } from './normalize-queue';

export const NormalizeQueuePage: FC = () => (
  <Layout
    title="Normalize queue"
    subtitle="Put keys to deposit queue"
    pageName="NormalizeQueue"
  >
    <NormalizeQueue />
  </Layout>
);
