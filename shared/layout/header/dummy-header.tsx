import { FC } from 'react';
import { HeaderBurger } from './components/header-burger';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import {
  HeaderActionsStyle,
  HeaderLogo,
  HeaderStyle,
  HeaderWrapper,
} from './styles';

export const DummyHeader: FC = () => (
  <HeaderWrapper>
    <HeaderStyle>
      <HeaderLogo>
        <Logos />
      </HeaderLogo>
      <HeaderActionsStyle>
        <HeaderTheme showAlways />
        <HeaderBurger />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderWrapper>
);
