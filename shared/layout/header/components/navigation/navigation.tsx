import { FC, memo } from 'react';
import { Stack } from 'shared/components';
import { useRouterPath } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { getIsActivePath } from 'utils/path';
import { Nav, NavLink } from './styles';
import { useNavItems } from './use-nav-items';

export const Navigation: FC = memo(() => {
  const routes = useNavItems();

  const pathname = useRouterPath();

  return (
    <Nav>
      {routes.map(({ name, path, subPaths, icon, suffix }) => {
        const isActive = getIsActivePath(pathname, path, subPaths);

        return (
          <LocalLink key={path} href={path}>
            <NavLink $active={isActive}>
              {icon}
              <Stack gap="sm" center>
                <span>{name}</span>
                {suffix}
              </Stack>
            </NavLink>
          </LocalLink>
        );
      })}
    </Nav>
  );
});
