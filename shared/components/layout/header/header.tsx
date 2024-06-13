import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import { config } from 'config';
import HeaderChain from './components/header-chain';
import HeaderNodeOperator from './components/header-node-operator';
import { HeaderSettingsButton } from './components/header-settings-button';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Navigation } from './components/navigation/navigation';
import { HeaderActionsStyle, HeaderStyle } from './styles';
import HeaderEaMember from './components/header-ea-member';

export const Header: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <LogoLido />
    <Navigation />
    <HeaderActionsStyle>
      <HeaderChain />
      <HeaderEaMember />
      <HeaderNodeOperator />
      <HeaderWallet />
      {config.ipfsMode && <HeaderSettingsButton />}
      <HeaderTheme />
    </HeaderActionsStyle>
  </HeaderStyle>
);
