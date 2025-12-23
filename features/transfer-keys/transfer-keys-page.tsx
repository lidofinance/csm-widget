import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { TransferKeys } from './transfer-keys';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const TransferKeysPage: FC = () => (
  <Layout
    title="Transfer keys"
    subtitle="Transfer your keys from the legacy to the priority queue"
    pageName="TransferKeys"
  >
    <KeysPageSwitcher />
    <TransferKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
