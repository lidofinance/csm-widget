import { Stack } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';
import { Disconnect } from '../disconnect/disconnect';

export const WalletModalConnectedStyle = styled(Stack).attrs({
  direction: 'row',
  align: 'center',
  justify: 'between',
  gap: 12,
})``;

export const WalletModalDisconnectStyle = styled(Disconnect)`
  flex-shrink: 0;
`;

export const WalletModalAccountStyle = styled(Stack).attrs({
  direction: 'row',
  align: 'center',
  gap: 8,
})`
  margin: 12px 0;
`;

export const WalletModalActionsStyle = styled(Stack).attrs({
  direction: 'row',
  wrap: true,
  gap: 8,
})``;
