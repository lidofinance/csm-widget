import { FC } from 'react';

import { Layout } from 'shared/components';
import { BondPageSwitcher } from 'shared/navigate';
import { ClaimBond } from './claim-bond';

export const ClaimBondPage: FC = () => (
  <Layout
    title="Manage Bond & Rewards"
    subtitle="Claim Bond to the Rewards address"
  >
    <BondPageSwitcher />
    <ClaimBond />
  </Layout>
);
