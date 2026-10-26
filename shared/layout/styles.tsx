import { Main, Typography } from '@lidofinance/lido-app-ui';
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
