import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 12px 16px;

  background: var(--lido-color-backgroundSecondary);
`;

export const ItemStyled = styled.div`
  display: flex;
  flex: 1 0 20%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  font-size: 14px;
  line-height: 24px;

  color: var(--lido-color-text);
  text-align: center;
`;

export const CountStyled = styled.b`
  font-size: 16px;
  font-weight: 700;
`;
