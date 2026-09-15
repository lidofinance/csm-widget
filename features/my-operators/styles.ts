import styled from 'styled-components';

export const ListStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const TilesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr;
  }
`;

export const CreateTileStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  padding: 20px 24px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  border: 1px solid var(--lido-color-border);
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: var(--lido-color-text);
  }
`;
