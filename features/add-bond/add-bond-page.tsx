import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { AddBond } from './add-bond';

export const AddBondPage: FC = () => (
  <Layout
    wide
    pageName="AddBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Add bond' },
    ]}
  >
    <AddBond />
  </Layout>
);
