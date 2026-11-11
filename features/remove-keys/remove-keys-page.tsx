import { FC } from 'react';

import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { RemoveKeys } from './remove-keys';

export const RemoveKeysPage: FC = () => (
  <Layout
    wide
    pageName="RemoveKeys"
    breadcrumbs={[{ label: 'Keys', href: PATH.KEYS }, { label: 'Delete' }]}
  >
    <RemoveKeys />
  </Layout>
);
