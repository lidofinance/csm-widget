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

export const DkgTable = styled.div`
  display: flex;
  flex-direction: column;
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
export const DkgIllustration = styled(DkgFileWarning)`
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  overflow: visible;
`;
