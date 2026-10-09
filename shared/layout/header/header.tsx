import { FC } from 'react';

import { HeaderBurger } from './components/header-burger';
import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Logos } from './components/logos';
import {
  HeaderActionsStyle,
  HeaderLogo,
  HeaderStyle,
  HeaderWrapper,
} from './styles';

export const Header: FC = () => (
  <HeaderWrapper>
    <HeaderStyle>
      <HeaderLogo>
        <Logos />
      </HeaderLogo>
      <HeaderActionsStyle>
        <HeaderChain />
        <HeaderWallet />
        <HeaderTheme />
        <HeaderBurger />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderWrapper>
);
