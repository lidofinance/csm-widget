import styled from 'styled-components';

export const RoleRowStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const RoleNameColumn = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  align-items: center;
  width: 180px;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

export const RoleAddressColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex: 1;
  min-width: 0;
  justify-content: center;
`;

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

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--lido-color-border);
  margin: 0;
`;

export const SplitterAddressRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  align-items: center;
`;

export const SplitShare = styled.span`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;
