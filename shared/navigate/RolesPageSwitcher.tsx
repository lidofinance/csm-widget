import {
  ROLES_INBOX_PATH,
  ROLES_MANAGER_PATH,
  ROLES_REWARDS_PATH,
} from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const ROLE_ROUTES: SwitchRoutes = [
  {
    title: 'Rewards address',
    path: ROLES_REWARDS_PATH,
  },
  {
    title: 'Manager address',
    path: ROLES_MANAGER_PATH,
  },
  { title: 'Inbox requests', path: ROLES_INBOX_PATH },
];

export const RolesPageSwitcher = () => <Switch routes={ROLE_ROUTES} />;
