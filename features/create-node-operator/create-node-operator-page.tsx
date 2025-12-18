import { FC } from 'react';

import { Layout } from 'shared/layout';
import { CreateNodeOperator } from './create-node-operator';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const CreateNodeOperatorPage: FC = () => (
  <Layout
    title="Create a Node Operator"
    subtitle="Upload your first key(s)"
    pageName="CreateNodeOperator"
  >
    <CreateNodeOperator />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
