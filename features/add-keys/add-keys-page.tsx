import { FC } from 'react';

import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { AddKeys } from './add-keys';

export const AddKeysPage: FC = () => (
  <Layout
    wide
    pageName="AddKeys"
    breadcrumbs={[{ label: 'Keys', href: PATH.KEYS }, { label: 'Submit' }]}
  >
    <AddKeys />
  </Layout>
);
