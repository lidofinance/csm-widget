import { FC } from 'react';
import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle, HeaderWrapper } from './styles';

export const SemiDummyHeader: FC = () => (
  <HeaderWrapper>
    <HeaderStyle>
      <Logos />
      <HeaderActionsStyle>
        <HeaderChain />
        <HeaderTheme showAlways />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderWrapper>
);
