import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { EjectKeys } from './eject-keys';

export const EjectKeysPage: FC = () => (
  <Layout
    wide
    title="Delete validator keys"
    subtitle="Remove or eject your validator keys"
    pageName="EjectKeys"
  >
    <KeysPageSwitcher />
    <EjectKeys />
  </Layout>
);
