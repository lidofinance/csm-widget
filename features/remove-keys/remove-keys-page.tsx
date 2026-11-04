import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { RemoveKeys } from './remove-keys';

export const RemoveKeysPage: FC = () => (
  <Layout
    wide
    title="Delete validator keys"
    subtitle="Remove or eject your validator keys"
    pageName="RemoveKeys"
  >
    <KeysPageSwitcher />
    <RemoveKeys />
  </Layout>
);
