import { FC } from 'react';

import { Layout } from 'shared/layout';
import { CreateCuratedNodeOperator } from './create-curated-node-operator';

// CM-only: the CSM family goes through CreateOperatorPage, which needs the
// operator type.
export const CreateNodeOperatorPage: FC = () => (
  <Layout wide title="Create a Node Operator" pageName="CreateNodeOperator">
    <CreateCuratedNodeOperator />
  </Layout>
);
