import { FC, memo } from 'react';
import { Wallet, Stake } from '@lidofinance/lido-ui';

import {
  HOME_PATH,
  WITHDRAWALS_CLAIM_PATH,
  WITHDRAWALS_REQUEST_PATH,
  WRAP_PATH,
  getPathWithoutFirstSlash,
} from 'consts/urls';
import { LocalLink } from 'shared/components/local-link';
import { useRouterPath } from 'shared/hooks/use-router-path';

import { Nav, NavLink } from './styles';

const routes = [
  {
    name: 'Main',
    path: HOME_PATH,
    icon: <Stake data-testid="navMain" />,
    exact: true,
  },
  {
    name: 'Dashboard',
    path: WRAP_PATH,
    icon: <Wallet data-testid="navWrap" />,
    full_path: WITHDRAWALS_REQUEST_PATH,
    subPaths: [WITHDRAWALS_CLAIM_PATH],
  },
];
export const Navigation: FC = memo(() => {
  const pathname = useRouterPath();
  let pathnameWithoutQuery = pathname.split('?')[0];
  if (pathnameWithoutQuery[pathnameWithoutQuery.length - 1] === '/') {
    // Remove last '/'
    pathnameWithoutQuery = pathnameWithoutQuery.slice(0, -1);
  }

  return (
    <Nav>
      {routes.map(({ name, path, subPaths, icon }) => {
        const isActive =
          pathnameWithoutQuery === getPathWithoutFirstSlash(path) ||
          (path.length > 1 && pathnameWithoutQuery.startsWith(path)) ||
          (Array.isArray(subPaths) &&
            subPaths?.indexOf(pathnameWithoutQuery) > -1);

        return (
          <LocalLink key={path} href={path}>
            <NavLink active={isActive}>
              {icon}
              <span>{name}</span>
            </NavLink>
          </LocalLink>
        );
      })}
    </Nav>
  );
});
