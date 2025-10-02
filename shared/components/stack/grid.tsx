import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
`;
