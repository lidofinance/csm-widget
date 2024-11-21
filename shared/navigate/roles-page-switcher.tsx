import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';
import { CounterInvites } from 'shared/counters';

const ROLE_ROUTES: SwitchRoutes = [
  {
    title: 'Rewards Address',
    path: PATH.ROLES_REWARDS,
    showRules: ['HAS_MANAGER', 'HAS_REWARDS'],
  },
  {
    title: 'Manager Address',
    path: PATH.ROLES_MANAGER,
    showRules: ['HAS_MANAGER', 'HAS_REWARDS'],
  },
  {
    title: 'Inbox requests',
    path: PATH.ROLES_INBOX,
    suffix: <CounterInvites />,
  },
];

export const RolesPageSwitcher = () => <Switch routes={ROLE_ROUTES} />;
