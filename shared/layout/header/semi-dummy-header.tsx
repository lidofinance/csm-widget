import { FC } from 'react';
import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle } from './styles';

export const SemiDummyHeader: FC = () => (
  <HeaderStyle>
    <Logos />
    <HeaderActionsStyle>
      <HeaderChain />
      <HeaderTheme showAlways />
    </HeaderActionsStyle>
  </HeaderStyle>
);
