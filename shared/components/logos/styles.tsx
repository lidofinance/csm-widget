import styled from 'styled-components';

export const LogoLidoStyle = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 14px;
    justify-content: flex-start;
  }

  span {
    display: block;
  }
`;
