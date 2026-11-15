import { Main, Stack } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const MainStyled = styled(Main)`
  position: relative;
`;

// app-ui Disclaimer pins itself via `margin-top: auto`, which only works on a direct PageContent child, so the wrapper carries it
export const DisclaimersStyled = styled(Stack)`
  margin-top: auto;
`;
