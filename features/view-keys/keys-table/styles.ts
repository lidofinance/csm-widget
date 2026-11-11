import { Stack } from '@lidofinance/lido-app-ui';
import { StretchCard } from 'shared/components/stretch-stack/stretch-stack';
import styled from 'styled-components';

export const TableCardStyled = styled(StretchCard)`
  && {
    padding: 0;
    overflow: hidden;
    gap: 0;
  }
`;

export const ChipsAreaStyled = styled(Stack)`
  padding: 32px 32px 0;

  @media (max-width: 599px) {
    padding: 16px 16px 0;
  }
`;
