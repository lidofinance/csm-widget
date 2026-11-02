import { CreateTypeProvider } from 'providers/create-type-provider';
import { FC } from 'react';
import { CreatableOperatorType } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { CreateNodeOperator } from './create-node-operator';

export const CreateOperatorPage: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => (
  <CreateTypeProvider type={type}>
    <Layout title="Create a Node Operator" pageName="CreateNodeOperator" wide>
      <CreateNodeOperator type={type} />
    </Layout>
  </CreateTypeProvider>
);
