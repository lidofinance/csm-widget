import { FC } from 'react';

import { Decor } from '../decor';
import { HeaderBurger } from './components/header-burger';
import HeaderChain from './components/header-chain';
import HeaderNodeOperator from './components/header-node-operator';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Logos } from './components/logos';
import { HeaderCustomActionsSlot } from './header-custom-actions-slot';
import { HeaderActionsStyle, HeaderStyle, HeaderWrapper } from './styles';

export const Header: FC = () => (
  <HeaderWrapper>
    <HeaderStyle>
      <Logos />
      <HeaderActionsStyle>
        <HeaderChain />
        <HeaderCustomActionsSlot />
        <HeaderNodeOperator />
        <HeaderWallet />
        <HeaderTheme />
        <HeaderBurger />
      </HeaderActionsStyle>
    </HeaderStyle>
    <Decor />
  </HeaderWrapper>
);
