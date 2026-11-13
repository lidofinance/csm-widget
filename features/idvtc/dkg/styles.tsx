import { Body } from '@lidofinance/lido-app-ui';
import DkgFileWarning from 'assets/illustrations/dkg-file-warning.svg?react';
import styled, { css } from 'styled-components';

export const DropArea = styled.div<{ $dragActive?: boolean }>`
  align-self: stretch;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--lido-app-ui-space-16);
  border-radius: 10px;
  transition: outline-color 0.1s ease;
  outline: 2px dashed transparent;
  outline-offset: 4px;
  ${({ $dragActive }) =>
    $dragActive &&
    css`
      outline-color: var(--lido-app-ui-color-border-active);
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
  gap: var(--lido-app-ui-space-16);
  padding-bottom: var(--lido-app-ui-space-8);
`;

export const DkgRow = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  gap: var(--lido-app-ui-space-16);
  padding: var(--lido-app-ui-space-16) 0;
  border-top: 1px solid var(--lido-app-ui-color-border-default);

  &:first-child {
    border-top: none;
  }
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--lido-app-ui-space-4);
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

export const DkgIllustration = styled(DkgFileWarning)`
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  overflow: visible;
`;
