import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { TransferKeys } from './transfer-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const TransferKeysPage: FC = () => (
  <Layout
    title="Transfer keys"
    subtitle="Transfer your keys from the legacy to the priority queue"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageTransferKeys}
  >
    <KeysPageSwitcher />
    <TransferKeys />
  </Layout>
);
