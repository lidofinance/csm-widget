import { FC } from 'react';

import { Layout } from 'shared/layout';
import { CreateNodeOperator } from './create-node-operator';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const CreateNodeOperatorPage: FC = () => (
  <Layout
    title="Create a Node Operator"
    subtitle="Upload your first key(s)"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageCreateNodeOperator}
  >
    <CreateNodeOperator />
  </Layout>
);
