import { FC } from 'react';

import { Layout } from 'shared/layout';
import { CreateNodeOperator } from './create-node-operator';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';
import { config } from 'config';
import { MODULE } from 'consts';
import { CreateCuratedNodeOperator } from './create-curated-node-operator';

const isCM = config.module === MODULE.CM;

export const CreateNodeOperatorPage: FC = () => (
  <Layout
    title="Create a Node Operator"
    subtitle={
      isCM
        ? 'Start with creating a Sub-Node Operator'
        : 'Upload your first key(s)'
    }
    pageName="CreateNodeOperator"
  >
    {isCM ? <CreateCuratedNodeOperator /> : <CreateNodeOperator />}
    <Faq items={FAQ_KEYS} />
  </Layout>
);
