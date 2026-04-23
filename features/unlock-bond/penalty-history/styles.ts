import { Table } from 'shared/components';
import styled from 'styled-components';

export const WideWrapper = styled.div`
  margin-inline: -32px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-inline: -20px;
  }
`;

export const TableStyle = styled(Table)`
  grid-template-columns: 2fr 4fr 3fr 3fr;

  tr {
    gap: 8px 20px;

    ${({ theme }) => theme.mediaQueries.md} {
      grid-template-columns: 1fr;
      padding: 20px 32px;
    }
  }

  th:nth-child(3),
  th:nth-child(4),
  td:nth-child(3),
  td:nth-child(4) {
    text-align: right;
    justify-self: end;
  }

  thead {
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }

  th:nth-child(5) {
    display: none;
  }

  td:nth-child(5) {
    grid-column: 1 / -1;

    &:empty {
      display: none;
    }
  }
`;
