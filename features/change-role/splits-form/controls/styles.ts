import styled from 'styled-components';

export const RowStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
  }
`;

export const AddressColumn = styled.div`
  flex: 1;
  min-width: 0;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-basis: 100%;
  }
`;

export const ShareColumn = styled.div`
  width: 90px;
  flex-shrink: 0;

  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    flex: 1;
  }
`;

export const WarningRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  & > a {
    flex-shrink: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    align-items: stretch;

    & > a,
    & > a > button {
      width: 100%;
    }
  }
`;
