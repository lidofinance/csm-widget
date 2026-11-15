import { Card, Stack, downQuery } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const TableCardStyled = styled(Card)`
  && {
    padding: 0;
    overflow: hidden;
    gap: 0;
  }
`;

export const ChipsAreaStyled = styled(Stack)`
  padding: 32px 32px 0;

  @media ${downQuery('sm')} {
    padding: 16px 16px 0;
  }
`;
