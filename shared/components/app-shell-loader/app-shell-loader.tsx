import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// rendered without providers: CSS vars from LidoUIHead only, no `theme` access
const ShellGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: var(--lido-color-background);
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const AppShellLoader: FC = () => (
  <>
    <ShellGlobalStyle />
    <Wrapper>
      <Loader size="large" />
    </Wrapper>
  </>
);
