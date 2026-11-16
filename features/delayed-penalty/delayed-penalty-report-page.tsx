import { FC } from 'react';

import { Layout } from 'shared/layout';
import { DelayedPenaltyPageSwitcher } from 'shared/navigate';
import { DelayedPenaltyReport } from './delayed-penalty-report';

export const DelayedPenaltyReportPage: FC = () => (
  <Layout
    wide
    title="Report delayed penalty"
    subtitle="General delayed penalty"
  >
    <DelayedPenaltyPageSwitcher />
    <DelayedPenaltyReport />
  </Layout>
);
