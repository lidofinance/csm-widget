import { FC } from 'react';
import { HeaderBurger } from './components/header-burger';
import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import {
  HeaderActionsStyle,
  HeaderLogo,
  HeaderStyle,
  HeaderWrapper,
} from './styles';

export const SemiDummyHeader: FC = () => (
  <HeaderWrapper>
    <HeaderStyle>
      <HeaderLogo>
        <Logos />
      </HeaderLogo>
      <HeaderActionsStyle>
        <HeaderChain />
        <HeaderTheme showAlways />
        <HeaderBurger />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderWrapper>
);
