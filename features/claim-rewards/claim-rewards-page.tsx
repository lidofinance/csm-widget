import { FC } from 'react';

import { Layout, Switch } from 'shared/components';
import { ClaimRewards } from './claim-rewards';
import {
  BOND_CLAIM_PATH,
  BOND_CLAIM_REWARDS_PATH,
  BOND_PATH,
} from 'consts/urls';
import { SwitchRoutes } from 'shared/components/switch/types';

const BOND_ROUTES: SwitchRoutes = [
  { name: 'Add Bond', path: BOND_PATH },
  { name: 'Claim Bond', path: BOND_CLAIM_PATH },
  { name: 'Claim Rewards', path: BOND_CLAIM_REWARDS_PATH },
];

export const ClaimRewardsPage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Claim bond">
      <Switch active={2} routes={BOND_ROUTES} />
      <ClaimRewards />
    </Layout>
  );
};
