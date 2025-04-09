import { Dark, Light, ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, memo, PropsWithChildren } from 'react';
import { Stack } from 'shared/components';
import { useRouterPath } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { getIsActivePath } from 'utils/path';
import { Nav, NavBlockStyle, NavItems, NavLink, NavTitle } from './styles';
import { useNavItems } from './use-nav-items';

export const Navigation: FC = memo(() => {
  const { themeName, toggleTheme } = useThemeToggle();
  const { expanded, toggleExpanded } = useInpageNavigation();
  const routes = useNavItems();
  const pathname = useRouterPath();

  return (
    <Nav aria-expanded={expanded} hidden={routes.length === 0}>
      <NavBlock title="Community Staking Module">
        {routes.map(({ name, path, subPaths, icon, suffix }) => {
          const isActive = getIsActivePath(pathname, path, subPaths);

          return (
            <LocalLink key={path} href={path} onClick={toggleExpanded}>
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
      </NavBlock>
      <NavBlock title="Settings" onlyMobile>
        <NavLink onClick={toggleTheme}>
          {themeName === ThemeName.light ? <Dark /> : <Light />}
          <span>{themeName === ThemeName.light ? 'Dark' : 'Light'} theme</span>
        </NavLink>
      </NavBlock>
    </Nav>
  );
});

const NavBlock: FC<
  PropsWithChildren<{ title: string; onlyMobile?: boolean }>
> = ({ children, title, onlyMobile }) => {
  return (
    <NavBlockStyle $onlyMobile={onlyMobile}>
      <NavTitle>{title}</NavTitle>
      <NavItems>{children}</NavItems>
    </NavBlockStyle>
  );
};
