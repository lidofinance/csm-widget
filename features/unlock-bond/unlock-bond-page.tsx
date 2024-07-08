import { FC } from 'react';

import { Layout } from 'shared/components';
import { BondPageSwitcher } from 'shared/navigate';
import { UnlockBond } from './unlock-bond';

export const UnlockBondPage: FC = () => (
  <Layout title="Manage Bond & Rewards" subtitle="Cover locked bond">
    <BondPageSwitcher />
    <UnlockBond />
  </Layout>
);
