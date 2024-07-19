import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const ROLE_ROUTES: SwitchRoutes = [
  {
    title: 'Rewards address',
    path: PATH.ROLES_REWARDS,
  },
  {
    title: 'Manager address',
    path: PATH.ROLES_MANAGER,
  },
  { title: 'Inbox requests', path: PATH.ROLES_INBOX },
];

export const RolesPageSwitcher = () => <Switch routes={ROLE_ROUTES} />;
