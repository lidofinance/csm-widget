import { FAQ_KEYS } from 'faq';
import { CreateTypeProvider } from 'providers/create-type-provider';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { CreatableOperatorType } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { CreateNodeOperator } from './create-node-operator';

export const CreateOperatorPage: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => (
  <CreateTypeProvider type={type}>
    <Layout
      title="Create a Node Operator"
      subtitle="Upload your first key(s)"
      pageName="CreateNodeOperator"
    >
      <CreateNodeOperator />
      <Faq items={FAQ_KEYS} />
    </Layout>
  </CreateTypeProvider>
);
