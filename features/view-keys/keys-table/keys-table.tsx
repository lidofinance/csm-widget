import { EmptyState, Table, TableColumn } from '@lidofinance/lido-app-ui';
import {
  KeyWithStatus,
  MODULE_PROFILE,
  OperatorTopUpQueue,
} from '@lidofinance/lido-csm-sdk';
import {
  useModule,
  useNodeOperatorId,
  useOperatorTopUpQueue,
} from 'modules/web3';
import { TablePagination, useTable } from 'providers/table-provider';
import { FC, useMemo } from 'react';
import { useMaxPriorityKeyIndex } from 'shared/hooks';
import styled from 'styled-components';
import { BalanceCell } from './balance-cell';
import { KeyCell } from './key-cell';
import { StatusCell } from './status-cell';
import { StrikeDots } from './strike-dots';

type Row = KeyWithStatus;

const FooterStyled = styled.div`
  width: 100%;
`;

const selectTopUpPositions = ({ total, keys }: OperatorTopUpQueue) => ({
  total,
  positions: new Map(keys.map(({ index, position }) => [index, position])),
});

const getRowKey = (key: Row) => String(key.index);

export const KeysTable: FC = () => {
  const maxPriorityKeyIndex = useMaxPriorityKeyIndex();
  const { module, isCsmFamily } = useModule();
  const { data, sort, setSort } = useTable<Row>();
  const nodeOperatorId = useNodeOperatorId();
  const { data: topUpQueue } = useOperatorTopUpQueue({
    nodeOperatorId,
    select: selectTopUpPositions,
  });

  const showBalance = !!module && MODULE_PROFILE[module].allocatedBalance;

  const columns = useMemo<TableColumn<Row>[]>(
    () => [
      {
        key: 'pubkey',
        header: 'Key',
        sortable: true,
        render: (item) => (
          <KeyCell
            item={item}
            topUpPosition={topUpQueue?.positions.get(item.index)}
            topUpTotal={topUpQueue?.total}
          />
        ),
      },
      {
        key: 'statuses',
        header: 'Status',
        sortable: true,
        render: (item) => (
          <StatusCell item={item} maxPriorityKeyIndex={maxPriorityKeyIndex} />
        ),
      },
      ...(isCsmFamily
        ? [
            {
              key: 'strikes',
              header: 'Strikes',
              sortable: true,
              align: 'center',
              width: 80,
              render: ({ strikes }) => (
                <span data-testid="strikesCountCell">
                  <StrikeDots strikes={strikes} />
                </span>
              ),
            } as TableColumn<Row>,
          ]
        : []),
      ...(showBalance
        ? [
            {
              key: 'effectiveBalance',
              header: 'Balance',
              sortable: true,
              align: 'right',
              width: 160,
              render: ({ effectiveBalance }) => (
                <span data-testid="balanceCell">
                  <BalanceCell effectiveBalance={effectiveBalance} />
                </span>
              ),
            } as TableColumn<Row>,
          ]
        : []),
    ],
    [isCsmFamily, showBalance, maxPriorityKeyIndex, topUpQueue],
  );

  return (
    <Table
      columns={columns}
      rows={data}
      rowKey={getRowKey}
      minWidth={720}
      sort={sort && { key: String(sort.column), direction: sort.direction }}
      onSortChange={({ key, direction }) =>
        setSort({ column: key as keyof Row, direction })
      }
      emptyState={<EmptyState title="No keys at the moment" />}
      footer={
        <FooterStyled>
          <TablePagination />
        </FooterStyled>
      }
    />
  );
};
