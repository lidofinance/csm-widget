import { Logo, Spinner } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { WIDGET_DESCRIPTION, WIDGET_TITLE } from 'consts/module';

// rendered without providers: app-ui CSS vars are global (index.css), no `theme` access
const ShellGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: var(--lido-app-ui-color-background-default);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
  box-sizing: border-box;
  color: var(--lido-app-ui-color-text-default);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 18px 0;
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
  color: var(--lido-app-ui-color-text-secondary);
`;

export const AppShellLoader: FC = () => (
  <>
    <ShellGlobalStyle />
    <Wrapper>
      <Header>
        <Logo variant="full" product={WIDGET_TITLE} />
      </Header>
      <Main>
        <Title>{WIDGET_TITLE}</Title>
        <Description>{WIDGET_DESCRIPTION}</Description>
        <Spinner size="lg" label="Loading" />
      </Main>
    </Wrapper>
  </>
);
