import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import HeaderTheme from './components/header-theme';
import { HeaderActionsStyle, HeaderStyle } from './styles';

export const DummyHeader: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <LogoLido />
    <HeaderActionsStyle>
      <HeaderTheme />
    </HeaderActionsStyle>
  </HeaderStyle>
);
