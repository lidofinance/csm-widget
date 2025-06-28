import { PATH } from 'consts/urls';
import { ReactNode } from 'react';

import { Eth as EthIcon } from '@lidofinance/lido-ui';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import { ReactComponent as FileIcon } from 'assets/icons/file.svg';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import { ReactComponent as KeyIcon } from 'assets/icons/key.svg';
import { ReactComponent as MeterIcon } from 'assets/icons/meter.svg';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';
import {
  CounterIcs,
  CounterInvalidKeys,
  CounterInvites,
  CounterLockedBond,
  CounterSurveys,
} from 'shared/counters';
import { ShowRule, useFilterShowRules } from 'shared/hooks';

export type Route = {
  name: string;
  path: PATH;
  icon: JSX.Element;
  subPaths?: PATH[];
  showRules: ShowRule[];
  suffix?: ReactNode;
};

const routes: Route[] = [
  {
    name: 'Main',
    path: PATH.HOME,
    icon: <HomeIcon />,
    showRules: ['NOT_NODE_OPERATOR'],
  },
  {
    name: 'Dashboard',
    path: PATH.HOME,
    icon: <DashboardIcon />,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    name: 'Keys',
    path: PATH.KEYS,
    icon: <KeyIcon />,
    subPaths: [
      PATH.KEYS_SUBMIT,
      PATH.KEYS_REMOVE,
      PATH.KEYS_EJECT,
      PATH.KEYS_EXIT,
      PATH.KEYS_VIEW,
      PATH.KEYS_TRANSFER,
      PATH.CREATE,
    ],
    showRules: ['IS_NODE_OPERATOR', 'CAN_CREATE'],
    suffix: <CounterInvalidKeys />,
  },
  {
    name: 'Monitoring',
    path: PATH.MONITORING,
    icon: <MeterIcon />,
    showRules: ['IS_NODE_OPERATOR'],
    // TODO: suffix for bad attestation rate
  },
  {
    name: 'Bond & Rewards',
    path: PATH.BOND,
    icon: <WalletIcon />,
    subPaths: [PATH.BOND_ADD, PATH.BOND_CLAIM, PATH.BOND_UNLOCK],
    showRules: ['IS_NODE_OPERATOR'],
    suffix: <CounterLockedBond />,
  },
  {
    name: 'Roles',
    path: PATH.ROLES,
    icon: <GearIcon />,
    subPaths: [PATH.ROLES_MANAGER, PATH.ROLES_REWARDS, PATH.ROLES_INBOX],
    showRules: ['IS_NODE_OPERATOR', 'HAS_INVITES'],
    suffix: <CounterInvites />,
  },
  {
    name: 'Stealing',
    path: PATH.STEALING,
    icon: <EthIcon />,
    subPaths: [PATH.STEALING_REPORT, PATH.STEALING_CANCEL],
    showRules: ['EL_STEALING_REPORTER'],
  },
  {
    name: 'Surveys',
    path: PATH.SURVEYS,
    icon: <FileIcon />,
    showRules: ['IS_SURVEYS_ACTIVE'],
    suffix: <CounterSurveys />,
  },
  {
    name: 'Operator Type',
    path: PATH.TYPE,
    icon: <UserIcon />,
    subPaths: [PATH.TYPE_CLAIM],
    showRules: ['CAN_CLAIM_ICS'],
    suffix: <CounterIcs />,
  },
];

export const useNavItems = () => useFilterShowRules(routes);
