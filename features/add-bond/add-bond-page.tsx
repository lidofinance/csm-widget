import { FC } from 'react';

import {
  BOND_CLAIM_PATH,
  BOND_PATH,
  BOND_CLAIM_REWARDS_PATH,
} from 'consts/urls';
import { Layout, Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';
import { AddBond } from './add-bond';

const BOND_ROUTES: SwitchRoutes = [
  { name: 'Add Bond', path: BOND_PATH },
  { name: 'Claim Bond', path: BOND_CLAIM_PATH },
  { name: 'Claim Rewards', path: BOND_CLAIM_REWARDS_PATH },
];

export const AddBondPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Topup bond">
      <Switch active={0} routes={BOND_ROUTES} />
      <AddBond />
    </Layout>
  );
};
