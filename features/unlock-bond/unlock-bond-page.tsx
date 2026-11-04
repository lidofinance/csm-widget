import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { BondPageSwitcher } from 'shared/navigate';
import { UnlockBond } from './unlock-bond';

export const UnlockBondPage: FC = () => (
  <Layout
    wide
    title="Manage Bond & Rewards"
    subtitle="Cover locked bond"
    pageName="UnlockBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Cover locked bond' },
    ]}
  >
    <BondPageSwitcher />
    <UnlockBond />
  </Layout>
);
