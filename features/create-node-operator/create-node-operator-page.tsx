import { FC } from 'react';

import { Layout } from 'shared/components';
import { CreateNodeOperator } from './create-node-operator';

export const CreateNodeOperatorPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Upload your first keys">
      <CreateNodeOperator />
    </Layout>
  );
};
