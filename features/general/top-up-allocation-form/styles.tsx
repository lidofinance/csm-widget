import { Typography } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const SecondaryTextStyle = styled(Typography)`
  && {
    color: var(--lido-app-ui-color-text-secondary);
  }
`;

export const ConfirmButtonsStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;
