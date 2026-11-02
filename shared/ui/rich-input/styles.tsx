import { IconLockKeyhole } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const LockedLabelStyle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const LockIconStyle = styled(IconLockKeyhole)`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--lido-app-ui-color-icons-secondary);
`;
