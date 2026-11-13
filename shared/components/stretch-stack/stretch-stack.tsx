import { Card, Stack } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

// lib Card and Modal bodies align children to flex-start; this fills their width
export const StretchStack = styled(Stack)`
  align-self: stretch;
  min-width: 0;
`;

export const StretchCard = styled(Card)`
  && {
    align-items: stretch;
  }
`;
