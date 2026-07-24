import { FC } from 'react';

import { isModuleCM } from 'consts';
import { FAQ_KEYS } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { CreateCuratedNodeOperator } from './create-curated-node-operator';
import { CreateNodeOperator } from './create-node-operator';

export const CreateNodeOperatorPage: FC = () => (
  <Layout
    title="Create a Node Operator"
    subtitle={
      isModuleCM
        ? 'Start with creating a Sub-Node Operator'
        : 'Upload your first key(s)'
    }
    pageName="CreateNodeOperator"
  >
    {isModuleCM ? <CreateCuratedNodeOperator /> : <CreateNodeOperator />}
    <Faq items={FAQ_KEYS} />
  </Layout>
);
