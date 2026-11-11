import { CreateTypeProvider } from 'providers/create-type-provider';
import { FC } from 'react';
import { CreatableOperatorType } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { CREATE_CRUMBS } from './create-crumbs';
import { CreateNodeOperator } from './create-node-operator';

export const CreateOperatorPage: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => (
  <CreateTypeProvider type={type}>
    <Layout wide pageName="CreateNodeOperator" breadcrumbs={CREATE_CRUMBS}>
      <CreateNodeOperator type={type} />
    </Layout>
  </CreateTypeProvider>
);
