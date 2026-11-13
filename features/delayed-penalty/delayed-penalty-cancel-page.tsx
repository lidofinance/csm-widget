import { FC } from 'react';

import { Layout } from 'shared/layout';
import { DelayedPenaltyPageSwitcher } from 'shared/navigate';
import { DelayedPenaltyCancel } from './delayed-penalty-cancel';

export const DelayedPenaltyCancelPage: FC = () => (
  <Layout
    wide
    title="Cancel delayed penalty"
    subtitle="General delayed penalty"
  >
    <DelayedPenaltyPageSwitcher />
    <DelayedPenaltyCancel />
  </Layout>
);
