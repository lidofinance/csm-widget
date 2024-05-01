import { FC } from 'react';

import { Layout } from 'shared/components';
import { AddKeys } from './add-keys';

export const AddKeysPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Upload more keys">
      <AddKeys />
    </Layout>
  );
};
