import { FC } from 'react';

import { FAQ_KEYS } from 'faq';
import { useModule } from 'modules/web3';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { CreateCuratedNodeOperator } from './create-curated-node-operator';
import { CreateNodeOperator } from './create-node-operator';

export const CreateNodeOperatorPage: FC = () => {
  const { isCM } = useModule();

  return (
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
};
