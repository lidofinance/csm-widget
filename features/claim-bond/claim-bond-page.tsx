import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { ClaimBond } from './claim-bond';

export const ClaimBondPage: FC = () => (
  <Layout
    wide
    title="Manage Bond & Rewards"
    subtitle="Select a claiming option for bond and rewards"
    pageName="ClaimBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Claim' },
    ]}
  >
    <ClaimBond />
  </Layout>
);
