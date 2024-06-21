import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const RoleBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 12px;
  border: 1px solid var(--lido-color-border);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: 12px;
`;

export const RoleBlockHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const RoleBlockCurrent = styled.div``;

export const RoleBlockProposed = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--lido-color-warning);
  background-color: var(--lido-color-warningBackground);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  padding: ${({ theme }) => theme.spaceMap.xs}px
    ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;
