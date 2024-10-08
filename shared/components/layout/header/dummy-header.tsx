import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';

import HeaderTheme from './components/header-theme';
import { HeaderActionsStyle, HeaderContentStyle, HeaderStyle } from './styles';

export const DummyHeader: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <HeaderContentStyle>
      <LogoLido />
      <HeaderActionsStyle>
        <HeaderTheme />
      </HeaderActionsStyle>
    </HeaderContentStyle>
  </HeaderStyle>
);
