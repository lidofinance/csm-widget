import { FC } from 'react';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle } from './styles';

export const DummyHeader: FC = () => (
  <HeaderStyle>
    <Logos />
    <HeaderActionsStyle>
      <HeaderTheme showAlways />
    </HeaderActionsStyle>
  </HeaderStyle>
);
