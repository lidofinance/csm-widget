import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import { HeaderActionsStyle, HeaderStyle } from './styles';

export const Header: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <LogoLido />
    <HeaderActionsStyle>
      <HeaderChain />
      <HeaderTheme />
    </HeaderActionsStyle>
  </HeaderStyle>
);
