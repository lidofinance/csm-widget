import { FC } from 'react';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle } from './styles';
import { FeedbackLine } from './feedback-line';

export const DummyHeader: FC = () => (
  <HeaderStyle>
    <FeedbackLine />
    <Logos />
    <HeaderActionsStyle>
      <HeaderTheme showAlways />
    </HeaderActionsStyle>
  </HeaderStyle>
);
