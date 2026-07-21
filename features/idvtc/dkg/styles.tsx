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

export const Table = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  padding-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  color: var(--lido-color-textSecondary);
  font-size: 12px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px 0;
  border-top: 1px solid var(--lido-color-border);
`;

export const StagedRow = styled(Row)`
  grid-template-columns: 1fr auto;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  align-items: center;
`;

export const IconButton = styled.button`
  display: inline-flex;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  color: var(--lido-color-textSecondary);
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
