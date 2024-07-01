import { FC } from 'react';

import { Layout } from 'shared/components';
import { BondPageSwitcher } from 'shared/navigate';
import { AddBond } from './add-bond';

export const AddBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Add bond to your Bond balance"
  >
    <BondPageSwitcher />
    <AddBond />
  </Layout>
);
