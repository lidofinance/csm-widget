import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { AddBond } from './add-bond';
import { Faq } from 'shared/components';
import { FAQ_BOND } from 'faq';

export const AddBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Add bond to your Bond balance"
    pageName="AddBond"
  >
    <BondPageSwitcher />
    <AddBond />
    <Faq items={FAQ_BOND} />
  </Layout>
);
