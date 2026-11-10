import { Body, Card } from '@lidofinance/lido-app-ui';
import { ReactComponent as DkgFileWarning } from 'assets/illustrations/dkg-file-warning.svg';
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

export const AddButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const DkgTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DkgTableHead = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
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

export const FileName = styled(Body)<{ $inactive?: boolean }>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $inactive }) =>
    $inactive ? 'var(--lido-app-ui-color-text-tertiary)' : 'inherit'};
`;

export const EmptyStateIllustration = styled.span`
  display: block;
  line-height: 0;
  color: var(--lido-app-ui-color-text-tertiary);
`;

export const DkgCardStyle = styled(Card)`
  && {
    align-items: stretch;
  }
`;

export const DkgIllustration = styled(DkgFileWarning)`
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  overflow: visible;
`;
