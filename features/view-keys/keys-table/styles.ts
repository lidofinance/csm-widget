import { Card, Stack, downQuery } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const TableCardStyled = styled(Card).attrs({
  align: 'stretch',
  padding: 0,
  gap: 0,
  clip: true,
})``;

export const ChipsAreaStyled = styled(Stack)`
  padding: 32px 32px 0;

  @media ${downQuery('sm')} {
    padding: 16px 16px 0;
  }
`;
