import { PATH } from 'consts/urls';
import { CounterInvites } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const ROLE_ROUTES: SwitcherRoutes = [
  {
    title: 'Roles',
    path: PATH.ROLES,
    // subpaths: [
    //   PATH.ROLES_MANAGER_ADDRESS,
    //   PATH.ROLES_REWARDS_ADDRESS,
    //   PATH.ROLES_CLAIMER,
    //   PATH.ROLES_SPLITS,
    // ],
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    title: 'Inbox requests',
    path: PATH.ROLES_INBOX,
    suffix: <CounterInvites />,
  },
];

export const RolesPageSwitcher = () => <Switcher routes={ROLE_ROUTES} />;
