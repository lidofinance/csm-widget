import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { AddBond } from './add-bond';

export const AddBondPage: FC = () => (
  <Layout
    wide
    title="Manage Bond & Rewards"
    subtitle="Add bond to your Bond balance"
    pageName="AddBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Add bond' },
    ]}
  >
    <BondPageSwitcher />
    <AddBond />
  </Layout>
);
