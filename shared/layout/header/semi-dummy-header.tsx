import { FC } from 'react';
import HeaderChain from './components/header-chain';
import HeaderTheme from './components/header-theme';
import { Logos } from './components/logos';
import { HeaderActionsStyle, HeaderStyle, HeaderWrapper } from './styles';
import { FeedbackLine } from './feedback-line';

export const SemiDummyHeader: FC = () => (
  <HeaderWrapper>
    <FeedbackLine />
    <HeaderStyle>
      <Logos />
      <HeaderActionsStyle>
        <HeaderChain />
        <HeaderTheme showAlways />
      </HeaderActionsStyle>
    </HeaderStyle>
  </HeaderWrapper>
);
