import { Dark, Light, ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, memo, PropsWithChildren } from 'react';
import { Stack } from 'shared/components';
import { useInitialLoading, useRouterPath } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { getIsActivePath } from 'utils';
import {
  Nav,
  NavBlockStyle,
  NavContainer,
  NavItems,
  NavLink, // Keep NavLink for other links
  NavTitle,
  ThemeToggleButton, // Import the new button
} from './styles';
import { useNavItems } from './use-nav-items';
import { useCsmVersionSupported } from 'modules/web3';

export const Navigation: FC = memo(() => {
  const isLoading = useInitialLoading();
  const isSupported = useCsmVersionSupported();
  const { themeName, toggleTheme } = useThemeToggle();
  const { expanded, toggleExpanded } = useInpageNavigation();
  const routes = useNavItems();
  const pathname = useRouterPath();

  const hidden = isLoading || !isSupported || routes.length === 0;

  return (
    <Nav aria-expanded={expanded} hidden={hidden}>
      <NavContainer>
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
          {/* Use ThemeToggleButton instead of NavLink */}
          <ThemeToggleButton onClick={toggleTheme}>
            {/* Wrap icon in a span to prevent prop forwarding */}
            <span>{themeName === ThemeName.light ? <Dark /> : <Light />}</span>
            <span>
              {themeName === ThemeName.light ? 'Dark' : 'Light'} theme
            </span>
          </ThemeToggleButton>
        </NavBlock>
      </NavContainer>
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
