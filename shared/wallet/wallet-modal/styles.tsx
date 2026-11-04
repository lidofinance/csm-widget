import styled from 'styled-components';
import { Disconnect } from '../disconnect/disconnect';

export const WalletModalConnectedStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const WalletModalDisconnectStyle = styled(Disconnect)`
  flex-shrink: 0;
`;

export const WalletModalAccountStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
`;

export const WalletModalActionsStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
