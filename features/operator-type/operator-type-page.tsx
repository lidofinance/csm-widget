import { FC } from 'react';

import { Layout } from 'shared/layout';
import { TypeOptions } from './type-options';

export const OperatorTypePage: FC = () => (
  <Layout title="Operator Type" pageName="Type">
    <TypeOptions />
  </Layout>
);
