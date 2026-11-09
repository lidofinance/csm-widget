import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { UnlockBond } from './unlock-bond';

export const UnlockBondPage: FC = () => (
  <Layout
    wide
    pageName="UnlockBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Compensate locked bond' },
    ]}
  >
    <UnlockBond />
  </Layout>
);
