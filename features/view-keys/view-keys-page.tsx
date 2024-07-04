import { FC } from 'react';

import { Layout } from 'shared/components';
import { KeysPageSwitcher } from 'shared/navigate';
import { ViewKeys } from './view-keys';

export const ViewKeysPage: FC = () => (
  <Layout title="View keys list" subtitle="Check the list of your keys">
    <KeysPageSwitcher />
    <ViewKeys />
  </Layout>
);
