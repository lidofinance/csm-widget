import { Text } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

export const DropArea = styled.div<{ $dragActive?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  transition: outline-color 0.1s ease;
  outline: 2px dashed transparent;
  outline-offset: 4px;
  ${({ $dragActive }) =>
    $dragActive &&
    css`
      outline-color: var(--lido-color-primary);
    `}
`;

export const AddButtonRow = styled.div<{ $align?: 'start' | 'end' }>`
  display: flex;
  justify-content: ${({ $align }) =>
    $align === 'start' ? 'flex-start' : 'flex-end'};
`;

export const DkgTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DkgTableHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const DkgRow = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px 0;
  border-top: 1px solid var(--lido-color-border);

  &:first-child {
    border-top: none;
  }
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const FileName = styled(Text).attrs({ size: 'xs' })<{
  $inactive?: boolean;
}>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${({ $inactive }) => ($inactive ? 0.5 : 1)};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: ${({ theme }) => theme.spaceMap.xxl}px 0;
`;

export const EmptyStateIcon = styled.div`
  line-height: 0;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  color: var(--lido-color-textSecondary);
`;
