import { FC } from 'react';

import { isModuleCM } from 'consts';
import { FAQ_KEYS_CM, FAQ_KEYS_CSM } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { CreateCuratedNodeOperator } from './create-curated-node-operator';
import { CreateNodeOperator } from './create-node-operator';

// Pre-operator screen: no active operator here, so branch on the STATIC deploy
// module (not reactive useModule, which would always be undefined → CSM).
export const CreateNodeOperatorPage: FC = () => {
  return (
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
      <Faq items={isModuleCM ? FAQ_KEYS_CM : FAQ_KEYS_CSM} />
    </Layout>
  );
};
