import { Card } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const InviteCardStyle = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

export const InviteHeaderStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const InviteNameStyle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  line-height: 28px;
  font-weight: var(--lido-app-ui-font-weight-bold);
`;
