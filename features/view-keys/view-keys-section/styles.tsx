import { Table } from 'shared/components';
import styled from 'styled-components';

export const TableStyle = styled(Table)`
  grid-template-columns: 5fr 4fr 1fr;

  tr {
    gap: 12px 32px;

    ${({ theme }) => theme.mediaQueries.md} {
      grid-template-columns: 1fr;

      padding: 20px 32px;
    }
  }

  th:nth-child(4) {
    display: none;
  }

  td:nth-child(4) {
    grid-column: 1 / -1;

    &:empty {
      display: none;
    }
  }

  td:nth-child(3) {
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
