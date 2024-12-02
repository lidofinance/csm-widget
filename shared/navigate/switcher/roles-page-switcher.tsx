import { PATH } from 'consts/urls';
import { CounterInvites } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const ROLE_ROUTES: SwitcherRoutes = [
  {
    title: 'Rewards Address',
    path: PATH.ROLES_REWARDS,
    showRules: ['HAS_MANAGER_ROLE', 'HAS_REWARDS_ROLE'],
  },
  {
    title: 'Manager Address',
    path: PATH.ROLES_MANAGER,
    showRules: ['HAS_MANAGER_ROLE', 'HAS_REWARDS_ROLE'],
  },
  {
    title: 'Inbox requests',
    path: PATH.ROLES_INBOX,
    suffix: <CounterInvites />,
  },
];

export const RolesPageSwitcher = () => <Switcher routes={ROLE_ROUTES} />;
