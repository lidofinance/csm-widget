import { FC } from 'react';

import { Layout } from 'shared/components';
import { KeysPageSwitcher } from 'shared/navigate';
import { AddKeys } from './add-keys';

export const AddKeysPage: FC = () => (
  <Layout title="Submit validator keys" subtitle="Upload more keys">
    <KeysPageSwitcher />
    <AddKeys />
  </Layout>
);
