import { FC } from 'react';

import { Layout } from 'shared/components';
import { CreateNodeOperator } from './create-node-operator';

export const CreateNodeOperatorPage: FC = () => (
  <Layout title="Create a Node Operator" subtitle="Upload your first keys">
    <CreateNodeOperator />
  </Layout>
);
