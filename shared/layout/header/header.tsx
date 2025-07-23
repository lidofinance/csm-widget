import { FC } from 'react';

import { HeaderBurger } from './components/header-burger';
import HeaderChain from './components/header-chain';
import HeaderNodeOperator from './components/header-node-operator';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle } from './styles';
import { FeedbackLine } from './feedback-line';

export const Header: FC = () => (
  <HeaderStyle>
    <FeedbackLine />
    <Logos />
    <HeaderActionsStyle>
      <HeaderChain />
      <HeaderNodeOperator />
      <HeaderWallet />
      <HeaderTheme />
      <HeaderBurger />
    </HeaderActionsStyle>
  </HeaderStyle>
);
