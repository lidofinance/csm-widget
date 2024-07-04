import { FC } from 'react';

import { Layout } from 'shared/components';
import { KeysPageSwitcher } from 'shared/navigate';
import { RemoveKeys } from './remove-keys';

export const RemoveKeysPage: FC = () => (
  <Layout
    title="Remove validator keys"
    subtitle="Remove keys that has not been deposited yet"
  >
    <KeysPageSwitcher />
    <RemoveKeys />
  </Layout>
);
