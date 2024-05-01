import { FC } from 'react';

import { Layout } from 'shared/components';
import { AddBond } from './add-bond';

export const AddBondPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Topup bond">
      <AddBond />
    </Layout>
  );
};
