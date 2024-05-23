import { FC } from 'react';

import {
  ROLES_INVITES_PATH,
  ROLES_MANAGER_PATH,
  ROLES_REWARDS_PATH,
} from 'consts/urls';
import { Layout, Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';
import { ChangeManagerRole } from './change-manager-role';

const ROLE_ROUTES: SwitchRoutes = [
  { name: 'Reward Address', path: ROLES_REWARDS_PATH },
  { name: 'Manager Address', path: ROLES_MANAGER_PATH },
  { name: 'Invites', path: ROLES_INVITES_PATH },
];

export const ChangeManagerRolePage: FC = () => {
  return (
    <Layout title="Community Staking Module" subtitle="Change Manager Address">
      <Switch active={1} routes={ROLE_ROUTES} />
      <ChangeManagerRole />
    </Layout>
  );
};
