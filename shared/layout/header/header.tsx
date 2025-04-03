import { FC } from 'react';

import { config } from 'config';
import HeaderChain from './components/header-chain';
import HeaderEaMember from './components/header-ea-member';
import HeaderNodeOperator from './components/header-node-operator';
import { HeaderSettingsButton } from './components/header-settings-button';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle } from './styles';

export const Header: FC = () => (
  <HeaderStyle>
    <Logos />
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
