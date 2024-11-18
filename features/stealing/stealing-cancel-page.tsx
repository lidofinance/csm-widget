import { FC } from 'react';

import { Layout } from 'shared/layout';
import { StealingPageSwitcher } from 'shared/navigate';
import { StealingCancel } from './stealing-cancel';

export const StealingCancelPage: FC = () => (
  <Layout title="Cancel stealing" subtitle="EL rewards (MEV) stealing">
    <StealingPageSwitcher />
    <StealingCancel />
  </Layout>
);
