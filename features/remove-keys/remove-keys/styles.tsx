import { Typography } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const ErrorValueStyle = styled.span`
  color: var(--lido-app-ui-color-text-error);
`;

export const HintStyle = styled(Typography)`
  && {
    margin: 0;
    color: var(--lido-app-ui-color-text-secondary);
  }
`;
