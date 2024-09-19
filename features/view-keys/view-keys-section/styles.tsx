import { Block, Table } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const ViewKeysBlock = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;

export const TableStyle = styled(Table)`
  margin: -32px -32px;

  thead tr::before,
  thead tr::after,
  th {
    border-top: none;
  }

  th {
    padding: 24px 8px 16px 8px;
    min-width: 40px;
  }

  td {
    padding: 12px 8px;
  }

  th > div {
    display: flex;
    gap: ${({ theme }) => theme.spaceMap.xs}px;
    align-items: center;

    svg {
      width: 16px;
    }
  }

  td {
    border-bottom: none;
  }

  tbody tr:nth-child(odd) {
    background-color: var(--lido-color-accentControlBg);
  }
`;

export const AddressRow = styled(StackStyle).attrs({ $gap: 'xs' })`
  align-items: center;
`;
