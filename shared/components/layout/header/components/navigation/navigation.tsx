import { FC, memo, useCallback } from 'react';

import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { ReactComponent as DashboardIcon } from 'assets/icons/dashboard.svg';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import { ReactComponent as KeyIcon } from 'assets/icons/key.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet.svg';

import {
  BOND_ADD_PATH,
  BOND_CLAIM_PATH,
  BOND_CLAIM_REWARDS_PATH,
  BOND_LOCKED_PATH,
  BOND_PATH,
  HOME_PATH,
  KEYS_PATH,
  KEYS_REMOVE_PATH,
  KEYS_SUBMIT_PATH,
  KEYS_VIEW_PATH,
  ROLES_INBOX_PATH,
  ROLES_MANAGER_PATH,
  ROLES_PATH,
  ROLES_REWARDS_PATH,
} from 'consts/urls';
import { useNodeOperator } from 'providers/node-operator-provider';
import { LocalLink } from 'shared/components/local-link';
import { useAccount } from 'shared/hooks/use-account';
import { useRouterPath } from 'shared/hooks/use-router-path';
import { getIsActivePath } from 'utils/path';
import { Nav, NavLink } from './styles';
import { useCsmEarlyAdoption, useCsmStatus, useInvites } from 'shared/hooks';

type ShowConditions = 'HAS_INVITES' | 'HAS_LOCKED_BOND' | 'CAN_CREATE';

type Route = {
  name: string;
  path: string;
  icon: JSX.Element;
  subPaths?: string[];
  skip?: boolean;
  showRule?: ShowConditions;
};

const routesDisconnected: Route[] = [
  {
    name: 'Main',
    path: HOME_PATH,
    icon: <HomeIcon />,
  },
];

const routesConnected: Route[] = [
  {
    name: 'Main',
    path: HOME_PATH,
    icon: <HomeIcon />,
  },
  {
    name: 'Keys',
    path: KEYS_PATH,
    icon: <KeyIcon />,
    subPaths: [KEYS_SUBMIT_PATH],
    showRule: 'CAN_CREATE',
  },
  {
    name: 'Roles',
    path: ROLES_PATH,
    icon: <GearIcon />,
    subPaths: [ROLES_INBOX_PATH],
    showRule: 'HAS_INVITES',
  },
];

const routesNodeOperator: Route[] = [
  {
    name: 'Dashboard',
    path: HOME_PATH,
    icon: <DashboardIcon />,
  },
  {
    name: 'Keys',
    path: KEYS_PATH,
    icon: <KeyIcon />,
    subPaths: [KEYS_SUBMIT_PATH, KEYS_REMOVE_PATH, KEYS_VIEW_PATH],
  },
  {
    name: 'Bond & Rewards',
    path: BOND_PATH,
    icon: <WalletIcon />,
    subPaths: [BOND_ADD_PATH, BOND_CLAIM_PATH, BOND_CLAIM_REWARDS_PATH],
  },
  {
    name: 'Roles',
    path: ROLES_PATH,
    icon: <GearIcon />,
    subPaths: [ROLES_MANAGER_PATH, ROLES_REWARDS_PATH, ROLES_INBOX_PATH],
  },
  {
    name: 'Locked Bond',
    path: BOND_LOCKED_PATH,
    icon: <AlertIcon />,
    skip: true,
  },
];

export const Navigation: FC = memo(() => {
  const { active: isConnected } = useAccount();
  const { active, isListLoading } = useNodeOperator();
  const { data: invites } = useInvites();

  const {
    data: { proof },
  } = useCsmEarlyAdoption();
  const { data: status } = useCsmStatus();

  const checkRules = useCallback(
    (condition: ShowConditions) => {
      switch (condition) {
        case 'HAS_INVITES':
          return invites && invites.length > 0;
        case 'HAS_LOCKED_BOND':
          return false;
        case 'CAN_CREATE':
          return status?.isPublicRelease || !!proof;
        default:
          return false;
      }
    },
    [invites, proof, status?.isPublicRelease],
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
      {routes.map(
        ({ name, path, subPaths, icon, skip, showRule: showRule }) => {
          if (skip) return null;
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
        },
      )}
    </Nav>
  );
});
