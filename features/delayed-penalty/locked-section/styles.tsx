import { Table } from 'shared/components';
import styled from 'styled-components';

export const TableStyle = styled(Table)`
  grid-template-columns: auto 1fr 1fr;

  tr {
    gap: 12px 32px;

    ${({ theme }) => theme.mediaQueries.md} {
      grid-template-columns: 1fr;

      padding: 20px 32px;
    }
  }

  thead {
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }
`;
