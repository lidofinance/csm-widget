import { Stack } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const CardHeader = styled(Stack)`
  && > :first-child {
    align-self: stretch;
  }

  && > :not(:first-child) {
    flex-shrink: 0;
  }
`;

export const CardHeaderLine = styled(Stack).attrs({
  direction: 'row',
  align: 'center',
})`
  && {
    min-height: 36px;
  }
`;
