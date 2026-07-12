import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Eth as EthIcon, Plus as PlusIcon } from '@lidofinance/lido-ui';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import { ReactComponent as FileIcon } from 'assets/icons/file.svg';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import { ReactComponent as KeyIcon } from 'assets/icons/key.svg';
import { ReactComponent as MeterIcon } from 'assets/icons/meter.svg';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';
import { PATH } from 'consts/urls';
import type { ComponentType } from 'react';
import {
  CounterClaimType,
  CounterInvalidKeys,
  CounterInvites,
  CounterLockedBond,
  CounterSurveys,
} from 'shared/counters';
import type { ShowRuleProps } from 'shared/hooks';

export type NavRoute = ShowRuleProps & {
  name: string;
  path: PATH;
  subPaths?: PATH[];
  icon: ComponentType;
  suffix?: ComponentType;
  colored?: boolean;
};

// The nav-reachability test loads this module with jest mocks for the SDK,
// lido-ui, counters, and svg assets (see __tests__/nav-reachability.test.ts)
export const NAV_ROUTES: NavRoute[] = [
  {
    name: 'Main',
    path: PATH.HOME,
    icon: HomeIcon,
    showRules: ['NOT_NODE_OPERATOR'],
    module: MODULE_NAME.CSM,
  },
  {
    name: 'Dashboard',
    path: PATH.HOME,
    icon: DashboardIcon,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    name: 'Create Operator',
    path: PATH.CREATE,
    icon: PlusIcon,
    showRules: ['CAN_CREATE'],
  },
  {
    name: 'Keys',
    path: PATH.KEYS,
    subPaths: [
      PATH.KEYS_SUBMIT,
      PATH.KEYS_REMOVE,
      PATH.KEYS_EJECT,
      PATH.KEYS_EXIT,
      PATH.KEYS_VIEW,
    ],
    icon: KeyIcon,
    suffix: CounterInvalidKeys,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    name: 'Monitoring',
    path: PATH.MONITORING,
    icon: MeterIcon,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    name: 'Bond & Rewards',
    path: PATH.BOND,
    subPaths: [PATH.BOND_ADD, PATH.BOND_CLAIM, PATH.BOND_UNLOCK],
    icon: WalletIcon,
    suffix: CounterLockedBond,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    name: 'Settings',
    path: PATH.SETTINGS,
    subPaths: [
      PATH.SETTINGS_ROLES,
      PATH.SETTINGS_REWARDS_ADDRESS,
      PATH.SETTINGS_MANAGER_ADDRESS,
      PATH.SETTINGS_CLAIMER,
      PATH.SETTINGS_SPLITS,
      PATH.SETTINGS_INBOX,
      PATH.SETTINGS_METADATA,
    ],
    icon: GearIcon,
    suffix: CounterInvites,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    name: 'Inbox Requests',
    path: PATH.SETTINGS_INBOX,
    icon: GearIcon,
    suffix: CounterInvites,
    showRules: [['HAS_INVITES', 'NOT_NODE_OPERATOR']],
  },
  {
    name: 'Delayed penalty',
    path: PATH.DELAYED_PENALTY,
    subPaths: [PATH.DELAYED_PENALTY_REPORT, PATH.DELAYED_PENALTY_CANCEL],
    icon: EthIcon,
    showRules: ['EL_DELAYED_PENALTY_REPORTER'],
  },
  {
    name: 'Surveys',
    path: PATH.SURVEYS,
    icon: FileIcon,
    suffix: CounterSurveys,
    showRules: ['IS_SURVEYS_ACTIVE'],
  },
  {
    name: 'Operator Type',
    path: PATH.TYPE,
    subPaths: [
      PATH.TYPE_ICS_SYSTEM,
      PATH.TYPE_ICS_APPLY,
      PATH.TYPE_ICS_PARAMETERS,
      PATH.TYPE_ICS_CLAIM,
      PATH.TYPE_DVT_DESCRIPTION,
      PATH.TYPE_DVT_APPLY,
      PATH.TYPE_DVT_PARAMETERS,
      PATH.TYPE_DVT_CLAIM,
      PATH.TYPE_PARAMETERS,
    ],
    icon: UserIcon,
    suffix: CounterClaimType,
    showRules: ['CAN_CLAIM_ICS', 'CAN_CLAIM_IDVTC', 'ICS_APPLY_ENABLED'],
  },
];
