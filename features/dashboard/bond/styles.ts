import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: Row;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  padding: 20px;

  background: var(--lido-color-backgroundSecondary);
`;
