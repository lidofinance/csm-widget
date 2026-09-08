import { FC } from 'react';

import { FAQ_KEYS } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { CreateCuratedNodeOperator } from './create-curated-node-operator';

// CM-only: the CSM family goes through CreateOperatorPage, which needs the
// operator type.
export const CreateNodeOperatorPage: FC = () => (
  <Layout
    title="Create a Node Operator"
    subtitle="Start with creating a Sub-Node Operator"
    pageName="CreateNodeOperator"
  >
    <CreateCuratedNodeOperator />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
