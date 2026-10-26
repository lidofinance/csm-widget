import { Main, Typography } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const MainStyled = styled(Main)`
  position: relative;
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
