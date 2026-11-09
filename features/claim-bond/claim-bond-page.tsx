import { PATH } from 'consts/urls';
import { FC } from 'react';

import { Layout } from 'shared/layout';
import { ClaimBond } from './claim-bond';

export const ClaimBondPage: FC = () => (
  <Layout
    wide
    pageName="ClaimBond"
    breadcrumbs={[
      { label: 'Bond & Rewards', href: PATH.BOND },
      { label: 'Claim' },
    ]}
  >
    <ClaimBond />
  </Layout>
);
