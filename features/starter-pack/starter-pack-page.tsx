import { FC } from 'react';

import { Layout } from 'shared/components';
import { StarterPack } from './starter-pack';

export const StarterPackPage: FC = () => {
  return (
    <Layout title="Community Staking Module">
      <StarterPack />
    </Layout>
  );
};
