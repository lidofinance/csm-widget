import { FC } from 'react';

import { Layout, Switch } from 'shared/components';
import { ClaimBond } from './claim-bond';
import { BOND_CLAIM_PATH, BOND_PATH } from 'consts/urls';
import { SwitchRoutes } from 'shared/components/switch/types';

const BOND_ROUTES: SwitchRoutes = [
  { name: 'Add Bond', path: BOND_PATH },
  { name: 'Claim Bond', path: BOND_CLAIM_PATH },
];

export const ClaimBondPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Claim bond">
      <Switch active={1} routes={BOND_ROUTES} />
      <ClaimBond />
    </Layout>
  );
};
