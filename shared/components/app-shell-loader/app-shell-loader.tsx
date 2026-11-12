import { LidoLogo, Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { WIDGET_DESCRIPTION, WIDGET_TITLE } from 'consts/module';

// rendered without providers: CSS vars from LidoUIHead only, no `theme` access
const ShellGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: var(--lido-color-background);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
  box-sizing: border-box;
  color: var(--lido-color-text);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 28px;
  padding: 18px 0;
`;

const Divider = styled.span`
  align-self: stretch;
  border-left: 1px solid var(--lido-color-text);
  opacity: 0.6;
`;

const ShortTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
`;

const Description = styled.p`
  max-width: 560px;
  margin: 0 0 32px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--lido-color-textSecondary);
`;

export const AppShellLoader: FC = () => (
  <>
    <ShellGlobalStyle />
    <Wrapper>
      <Header>
        <LidoLogo as="span" />
        <Divider />
        <ShortTitle>{WIDGET_TITLE}</ShortTitle>
      </Header>
      <Main>
        <Title>{WIDGET_TITLE}</Title>
        <Description>{WIDGET_DESCRIPTION}</Description>
        <Loader size="large" />
      </Main>
    </Wrapper>
  </>
);
