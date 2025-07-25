import { FC } from 'react';
import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle } from './styles';
import { FeedbackLine } from './feedback-line';

export const SemiDummyHeader: FC = () => (
  <HeaderStyle>
    <FeedbackLine />
    <Logos />
    <HeaderActionsStyle>
      <HeaderChain />
      <HeaderTheme showAlways />
    </HeaderActionsStyle>
  </HeaderStyle>
);
