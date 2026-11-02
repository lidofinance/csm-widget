import { Main, Stack, Typography } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const MainStyled = styled(Main)`
  position: relative;
  /* legacy body color leaks into lib Typography, which sets none */
  color: var(--lido-app-ui-color-text-default);
`;

export const Subtitle = styled(Typography).attrs({
  variant: 'description',
  as: 'div',
})`
  color: var(--lido-color-textSecondary);

  &:empty {
    display: none;
  }
`;

// app-ui Disclaimer pins itself via `margin-top: auto`, which only works on a direct PageContent child, so the wrapper carries it
export const DisclaimersStyled = styled(Stack)`
  margin-top: auto;
`;
