import { Table } from 'shared/components';
import styled from 'styled-components';

type TableStyleProps = {
  $strikes?: boolean;
  $balance?: boolean;
};

export const TableStyle = styled(Table)<TableStyleProps>`
  grid-template-columns:
    5fr 4fr ${({ $strikes }) => ($strikes ? '1fr' : '')}
    ${({ $balance }) => ($balance ? '2fr' : '')};

  tr {
    gap: 12px 32px;

    ${({ theme }) => theme.mediaQueries.md} {
      grid-template-columns: 1fr;

      padding: 20px 32px;
    }
  }

  th:last-child {
    display: none;
  }

  td:last-child {
    grid-column: 1 / -1;
  }

  td:empty,
  td:has(> span:empty) {
    display: none;
  }

  td:nth-child(n + 3):not(:last-child) {
    justify-self: center;

    ${({ theme }) => theme.mediaQueries.md} {
      justify-self: start;
    }
  }

  thead {
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }
`;
