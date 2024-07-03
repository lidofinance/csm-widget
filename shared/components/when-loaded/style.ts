import styled from 'styled-components';

export const WrapperStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 400;
`;
