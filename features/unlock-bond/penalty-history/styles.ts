import { Accordion } from '@lidofinance/lido-ui';
import { Table } from 'shared/components';
import styled from 'styled-components';

export const AccordionStyle = styled(Accordion)`
  & > div + div > div {
    padding-inline: 0;
    padding-block-end: ${({ theme }) => theme.spaceMap.md}px;
  }
`;

export const Wrapper = styled.div`
  margin-inline: ${({ theme }) => theme.spaceMap.xxl}px;
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
