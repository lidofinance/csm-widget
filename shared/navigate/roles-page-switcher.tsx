import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const ROLE_ROUTES: SwitchRoutes = [
  {
    title: 'Rewards Address',
    path: PATH.ROLES_REWARDS,
    roles: [
      ROLE_CODE.MANAGER,
      ROLE_CODE.REWARDS,
      ROLE_CODE.REWARDS_AND_MANAGER,
    ],
  },
  {
    title: 'Manager Address',
    path: PATH.ROLES_MANAGER,
    roles: [
      ROLE_CODE.MANAGER,
      ROLE_CODE.REWARDS,
      ROLE_CODE.REWARDS_AND_MANAGER,
    ],
  },
  { title: 'Inbox requests', path: PATH.ROLES_INBOX },
];

export const RolesPageSwitcher = () => <Switch routes={ROLE_ROUTES} />;
