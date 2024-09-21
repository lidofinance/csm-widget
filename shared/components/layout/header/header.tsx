import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import { config } from 'config';
import { AlertContainer } from 'shared/alerts';
import HeaderChain from './components/header-chain';
import HeaderEaMember from './components/header-ea-member';
import HeaderNodeOperator from './components/header-node-operator';
import { HeaderSettingsButton } from './components/header-settings-button';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Navigation } from './components/navigation/navigation';
import { HeaderActionsStyle, HeaderContentStyle, HeaderStyle } from './styles';

export const Header: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <HeaderContentStyle>
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
    </HeaderContentStyle>
    <AlertContainer />
  </HeaderStyle>
);
