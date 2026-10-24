import { Logo, SidebarGroup, SidebarItem } from '@lidofinance/lido-app-ui';
import { WIDGET_TITLE } from 'consts';
import { PATH } from 'consts/urls';
import {
  useModule,
  useNodeOperator,
  useSmVersionSupported,
} from 'modules/web3';
import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import { FC, memo, useContext } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { useInitialLoading, useRouterPath } from 'shared/hooks';
import { OperatorTypeButton, SwitchOperatorButton } from 'shared/node-operator';
import { getIsActivePath } from 'utils';
import { SidebarOperatorGroup, SidebarStyle } from './styles';
import { useNavItems } from './use-nav-items';

const SidebarLogo: FC = () => (
  <Logo variant="full" product={WIDGET_TITLE} href={PATH.HOME} />
);

const ShellNavigation: FC = () => <SidebarStyle logo={<SidebarLogo />} />;

const OperatorNavigation: FC = () => {
  const isLoading = useInitialLoading();
  const { module } = useModule();
  const { data: isSupported } = useSmVersionSupported(module);
  const { nodeOperator } = useNodeOperator();
  const routes = useNavItems();
  const pathname = useRouterPath();

  const isUpgrading = isSupported === false;
  const showItems = !isLoading && !isUpgrading;
  // operator queries against an upgrading module may stay pending through retries; don't hold the footer on them
  const showFooter = !!nodeOperator && (isUpgrading || !isLoading);

  return (
    <SidebarStyle
      logo={<SidebarLogo />}
      footer={
        !showFooter ? undefined : (
          <NoSSRWrapper>
            <SidebarOperatorGroup>
              <OperatorTypeButton data-testid="nodeOperatorCurve" />
              <SwitchOperatorButton data-testid="nodeOperatorHeader" />
            </SidebarOperatorGroup>
          </NoSSRWrapper>
        )
      }
    >
      {showItems && (
        <SidebarGroup label="My node operator" data-testid="navBlockMain">
          {routes.map(({ name, path, subPaths, icon, suffix }) => (
            <SidebarItem
              key={path + name}
              href={path}
              data-testid="navItem"
              icon={icon}
              active={getIsActivePath(pathname, path, subPaths)}
              counter={suffix}
            >
              {name}
            </SidebarItem>
          ))}
        </SidebarGroup>
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
