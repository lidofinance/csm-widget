import { PATH } from 'consts/urls';
import { CounterInvites } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';

const ROLE_ROUTES: SwitcherRoutes = [
  {
    title: 'Roles',
    path: PATH.SETTINGS_ROLES,
    subpaths: [
      PATH.SETTINGS_MANAGER_ADDRESS,
      PATH.SETTINGS_REWARDS_ADDRESS,
      PATH.SETTINGS_CLAIMER,
      PATH.SETTINGS_SPLITS,
    ],
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    title: 'Meta data',
    path: PATH.SETTINGS_METADATA,
    showRules: ['IS_NODE_OPERATOR'],
    module: MODULE_NAME.CSM,
  },
  {
    title: 'Inbox requests',
    path: PATH.SETTINGS_INBOX,
    suffix: <CounterInvites />,
  },
];

export const SettingsPageSwitcher = () => <Switcher routes={ROLE_ROUTES} />;
