import { Logo, SidebarGroup, SidebarItem } from '@lidofinance/lido-app-ui';
import { Dark, Light, ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import { WIDGET_TITLE } from 'consts';
import { PATH } from 'consts/urls';
import { useNodeOperator, useSmVersionSupported } from 'modules/web3';
import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, memo, useContext } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { useInitialLoading, useRouterPath } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { OperatorTypeButton, SwitchOperatorButton } from 'shared/node-operator';
import { getIsActivePath } from 'utils';
import { MobileOnlyGroup, SidebarOperatorGroup, SidebarStyle } from './styles';
import { useNavItems } from './use-nav-items';

const SidebarLogo: FC = () => (
  <LocalLink href={PATH.HOME} asChild>
    <Logo variant="full" product={WIDGET_TITLE} />
  </LocalLink>
);

const ThemeGroup: FC = () => {
  const { themeName, toggleTheme } = useThemeToggle();
  return (
    <MobileOnlyGroup>
      <SidebarItem
        icon={themeName === ThemeName.light ? <Dark /> : <Light />}
        onClick={toggleTheme}
      >
        {themeName === ThemeName.light ? 'Dark' : 'Light'} theme
      </SidebarItem>
    </MobileOnlyGroup>
  );
};

const ShellNavigation: FC = () => {
  const { expanded, toggleExpanded } = useInpageNavigation();
  return (
    <SidebarStyle
      open={expanded}
      onClose={toggleExpanded}
      logo={<SidebarLogo />}
    >
      <ThemeGroup />
    </SidebarStyle>
  );
};

const OperatorNavigation: FC = () => {
  const isLoading = useInitialLoading();
  const { data: isSupported } = useSmVersionSupported();
  const { nodeOperator } = useNodeOperator();
  const { expanded, toggleExpanded } = useInpageNavigation();
  const routes = useNavItems();
  const pathname = useRouterPath();

  const hidden = isLoading || isSupported === false;
  const closeDrawer = () => expanded && toggleExpanded();

  return (
    <SidebarStyle
      open={expanded}
      onClose={toggleExpanded}
      logo={<SidebarLogo />}
      footer={
        hidden || !nodeOperator ? undefined : (
          <NoSSRWrapper>
            <SidebarOperatorGroup>
              <OperatorTypeButton data-testid="nodeOperatorCurve" />
              <SwitchOperatorButton data-testid="nodeOperatorHeader" />
            </SidebarOperatorGroup>
          </NoSSRWrapper>
        )
      }
    >
      {!hidden && (
        <>
          <SidebarGroup label="My node operator" data-testid="navBlockMain">
            {routes.map(({ name, path, subPaths, icon, suffix }) => (
              <LocalLink
                key={path + name}
                href={path}
                asChild
                data-testid="navItem"
              >
                <SidebarItem
                  icon={icon}
                  active={getIsActivePath(pathname, path, subPaths)}
                  counter={suffix}
                  onClick={closeDrawer}
                >
                  {name}
                </SidebarItem>
              </LocalLink>
            ))}
          </SidebarGroup>
          <ThemeGroup />
        </>
      )}
    </SidebarStyle>
  );
};

export const Navigation: FC = memo(() =>
  useContext(NodeOperatorContext) ? (
    <OperatorNavigation />
  ) : (
    <ShellNavigation />
  ),
);
