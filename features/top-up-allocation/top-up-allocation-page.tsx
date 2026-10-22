import { FC } from 'react';

import { Layout } from 'shared/layout';
import { TopUpAllocation } from './top-up-allocation';

export const TopUpAllocationPage: FC = () => (
  <Layout title="Enable top-up allocation" subtitle="Curated Module Committee">
    <TopUpAllocation />
  </Layout>
);
