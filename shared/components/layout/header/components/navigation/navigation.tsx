import { FC, memo, useCallback } from 'react';

import { Eth as EthIcon } from '@lidofinance/lido-ui';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import { ReactComponent as KeyIcon } from 'assets/icons/key.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';

import { PATH } from 'consts/urls';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { LocalLink } from 'shared/components/local-link';
import {
  useCanCreateNodeOperator,
  useInvites,
  useIsReportStealingRole,
} from 'shared/hooks';
import { useAccount } from 'shared/hooks/use-account';
import { useRouterPath } from 'shared/hooks/use-router-path';
import { getIsActivePath } from 'utils/path';
import { Nav, NavLink } from './styles';

type ShowConditions = 'HAS_INVITES' | 'CAN_CREATE' | 'EL_STEALING_REPORTER';

type Route = {
  name: string;
  path: PATH;
  icon: JSX.Element;
  subPaths?: PATH[];
  showRule?: ShowConditions;
};

const routesDisconnected: Route[] = [
  {
    name: 'Main',
    path: PATH.HOME,
    icon: <HomeIcon />,
  },
];

const routesConnected: Route[] = [
  {
    name: 'Main',
    path: PATH.HOME,
    icon: <HomeIcon />,
  },
  {
    name: 'Keys',
    path: PATH.CREATE,
    icon: <KeyIcon />,
    showRule: 'CAN_CREATE',
  },
  {
    name: 'Roles',
    path: PATH.ROLES,
    icon: <GearIcon />,
    subPaths: [PATH.ROLES_INBOX],
    showRule: 'HAS_INVITES',
  },
  {
    name: 'Stealing',
    path: PATH.STEALING,
    icon: <EthIcon />,
    subPaths: [PATH.STEALING_REPORT, PATH.STEALING_CANCEL],
    showRule: 'EL_STEALING_REPORTER',
  },
];

const routesNodeOperator: Route[] = [
  {
    name: 'Dashboard',
    path: PATH.HOME,
    icon: <DashboardIcon />,
  },
  {
    name: 'Keys',
    path: PATH.KEYS,
    icon: <KeyIcon />,
    subPaths: [PATH.KEYS_SUBMIT, PATH.KEYS_REMOVE, PATH.KEYS_VIEW],
  },
  {
    name: 'Bond & Rewards',
    path: PATH.BOND,
    icon: <WalletIcon />,
    subPaths: [PATH.BOND_ADD, PATH.BOND_CLAIM, PATH.BOND_UNLOCK],
  },
  {
    name: 'Roles',
    path: PATH.ROLES,
    icon: <GearIcon />,
    subPaths: [PATH.ROLES_MANAGER, PATH.ROLES_REWARDS, PATH.ROLES_INBOX],
  },
  {
    name: 'Stealing',
    path: PATH.STEALING,
    icon: <EthIcon />,
    subPaths: [PATH.STEALING_REPORT, PATH.STEALING_CANCEL],
    showRule: 'EL_STEALING_REPORTER',
  },
];

export const Navigation: FC = memo(() => {
  const { active: isConnected } = useAccount();
  const { active, isListLoading } = useNodeOperatorContext();
  const { data: invites } = useInvites();
  const { data: isReportingRole } = useIsReportStealingRole();
  const canCreateNO = useCanCreateNodeOperator();

  const checkRules = useCallback(
    (condition: ShowConditions) => {
      switch (condition) {
        case 'HAS_INVITES':
          return Boolean(invites?.length);
        case 'CAN_CREATE':
          return canCreateNO;

        case 'EL_STEALING_REPORTER':
          return isReportingRole;
        default:
          return false;
      }
    },
    [canCreateNO, invites?.length, isReportingRole],
  );

  const routes =
    !isConnected || isListLoading
      ? routesDisconnected
      : !active
        ? routesConnected
        : routesNodeOperator;

  const pathname = useRouterPath();

  return (
    <Nav>
      {routes.map(({ name, path, subPaths, icon, showRule }) => {
        if (showRule && !checkRules(showRule)) return null;
        const isActive = getIsActivePath(pathname, path, subPaths);

        return (
          <LocalLink key={path} href={path}>
            <NavLink $active={isActive}>
              {icon}
              <span>{name}</span>
            </NavLink>
          </LocalLink>
        );
      })}
    </Nav>
  );
});
