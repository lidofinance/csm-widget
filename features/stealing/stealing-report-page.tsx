import { FC } from 'react';

import { Layout } from 'shared/components';
import { StealingPageSwitcher } from 'shared/navigate';
import { StealingReport } from './stealing-report';

export const StealingReportPage: FC = () => (
  <Layout title="Report stealing" subtitle="EL rewards (MEV) stealing">
    <StealingPageSwitcher />
    <StealingReport />
  </Layout>
);
