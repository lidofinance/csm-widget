import { FC } from 'react';

import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { EjectKeys } from './eject-keys';

export const EjectKeysPage: FC = () => (
  <Layout
    wide
    pageName="EjectKeys"
    breadcrumbs={[{ label: 'Keys', href: PATH.KEYS }, { label: 'Delete' }]}
  >
    <EjectKeys />
  </Layout>
);
