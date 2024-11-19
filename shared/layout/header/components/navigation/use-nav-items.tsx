import { PATH } from 'consts/urls';
import { ReactNode, useMemo } from 'react';
import { ShowRules, useShowRules } from './use-show-rules';

import { Eth as EthIcon } from '@lidofinance/lido-ui';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import { ReactComponent as KeyIcon } from 'assets/icons/key.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';
import {
  CounterInvalidKeys,
  CounterInvites,
  CounterLockedBond,
} from 'shared/counters';

export type Route = {
  name: string;
  path: PATH;
  icon: JSX.Element;
  subPaths?: PATH[];
  showRules: ShowRules[];
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
    subPaths: [PATH.KEYS_SUBMIT, PATH.KEYS_REMOVE, PATH.KEYS_VIEW, PATH.CREATE],
    showRules: ['IS_NODE_OPERATOR', 'CAN_CREATE'],
    suffix: <CounterInvalidKeys />,
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
];

export const useNavItems = () => {
  const check = useShowRules();

  return useMemo(
    () =>
      routes.filter(({ showRules }) => showRules.some((rule) => check(rule))),
    [check],
  );
};
