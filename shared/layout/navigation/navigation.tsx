import { Dark, Light, ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import { config } from 'config';
import { MODULE_METADATA } from 'consts';
import { useSmVersionSupported } from 'modules/web3';
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

export const Navigation: FC<{ desktopHidden?: boolean }> = memo(
  ({ desktopHidden }) => {
    const isLoading = useInitialLoading();
    const isSupported = useSmVersionSupported();
    const { themeName, toggleTheme } = useThemeToggle();
    const { expanded, toggleExpanded } = useInpageNavigation();
    const routes = useNavItems();
    const pathname = useRouterPath();

    const hidden = isLoading || !isSupported || routes.length === 0;

    return (
      <Nav
        aria-expanded={expanded}
        hidden={hidden}
        data-desktop-hidden={desktopHidden || undefined}
        $desktopHidden={desktopHidden}
      >
        <NavContainer data-testid="navBlockMain">
          <NavBlock title={MODULE_METADATA[config.module].title}>
            {routes.map(({ name, path, subPaths, icon, suffix, colored }) => {
              const isActive = getIsActivePath(pathname, path, subPaths);

              return (
                <LocalLink
                  key={path}
                  href={path}
                  onClick={toggleExpanded}
                  data-testid="navItem"
                >
                  <NavLink $active={isActive} $colored={colored}>
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
              <span>
                {themeName === ThemeName.light ? <Dark /> : <Light />}
              </span>
              <span>
                {themeName === ThemeName.light ? 'Dark' : 'Light'} theme
              </span>
            </ThemeToggleButton>
          </NavBlock>
        </NavContainer>
      </Nav>
    );
  },
);

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
