import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { NormalizeQueue } from './normalize-queue';

export const NormalizeQueuePage: FC = () => (
  <Layout
    wide
    title="Normalize queue"
    subtitle="Put keys to deposit queue"
    pageName="NormalizeQueue"
    breadcrumbs={[
      { label: 'Keys', href: PATH.KEYS },
      { label: 'Normalize queue' },
    ]}
  >
    <NormalizeQueue />
  </Layout>
);
