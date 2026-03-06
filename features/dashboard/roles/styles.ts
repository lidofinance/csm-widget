import { Divider } from '@lidofinance/lido-ui';
import { Grid } from 'shared/components';
import styled from 'styled-components';

export const RolesGrid = styled(Grid)`
  grid-template-columns: 1fr 1fr;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr;
  }
`;

export const RoleRowStyle = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  align-items: start;
  gap: inherit;
`;

// TODO: common component for pending address change
export const PendingChangeStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  align-items: center;
  background: rgba(236, 134, 0, 0.1);
  border-radius: 4px;
  padding: 4px 6px;
  overflow: hidden;

  color: var(--lido-color-warning);
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  svg {
    width: 14px;
    height: 12px;
    flex-shrink: 0;
  }
`;

export const DividerStyle = styled(Divider)`
  grid-column: 1 / -1;
`;
