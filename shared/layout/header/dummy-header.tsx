import { FC } from 'react';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle, HeaderWrapper } from './styles';

export const DummyHeader: FC = () => (
  <HeaderWrapper>
    <HeaderStyle>
      <Logos />
      <HeaderActionsStyle>
        <HeaderTheme showAlways />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderWrapper>
);
