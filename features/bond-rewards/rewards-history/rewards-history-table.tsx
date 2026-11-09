import { Copy, Table, TableColumn } from '@lidofinance/lido-app-ui';
import {
  MODULE_PROFILE,
  TOKENS,
  ValidatorRewardsEntity,
} from '@lidofinance/lido-csm-sdk';
import { useModule } from 'modules/web3';
import { TablePagination, useTable } from 'providers/table-provider';
import { FC, useMemo } from 'react';
import { Date, Pubkey } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { notifyCopied } from 'shared/hooks';
import { formatPercent } from 'utils';
import { Performance } from './performance';

type Row = ValidatorRewardsEntity;

const NOWRAP = { whiteSpace: 'nowrap' } as const;

const getColumns = (showBalance: boolean): TableColumn<Row>[] => [
  {
    key: 'startTimestamp',
    header: 'Date period',
    sortable: true,
    render: ({ startTimestamp, endTimestamp }) => (
      <span style={NOWRAP}>
        <Date timestamp={startTimestamp} /> &mdash;{' '}
        <Date timestamp={endTimestamp} />
      </span>
    ),
  },
  {
    key: 'pubkey',
    header: 'Key',
    sortable: true,
    render: ({ pubkey, validatorIndex }) =>
      pubkey ? (
        <Pubkey
          pubkey={pubkey}
          symbols={6}
          link={<Copy text={pubkey} onCopy={notifyCopied} />}
        />
      ) : (
        validatorIndex
      ),
  },
  {
    key: 'fee',
    header: 'Fee',
    sortable: true,
    align: 'right',
    render: ({ fee }) => formatPercent(fee),
  },
  {
    key: 'performance',
    header: 'Performance',
    sortable: true,
    align: 'right',
    render: (record) => <Performance {...record} />,
  },
  {
    key: 'threshold',
    header: 'Threshold',
    sortable: true,
    align: 'right',
    render: ({ threshold }) => formatPercent(threshold),
  },
  {
    key: 'receivedRewards',
    header: 'Rewards, stETH',
    sortable: true,
    align: 'right',
    info: showBalance
      ? "Rewards depend on the key's fee, performance, and balance throughout the reporting frame"
      : "Rewards depend on the key's fee and performance throughout the reporting frame",
    render: ({ receivedRewards }) => (
      <FormatToken amount={receivedRewards} token={TOKENS.steth} />
    ),
  },
  ...(showBalance
    ? [
        {
          key: 'effectiveBalance',
          header: 'Balance',
          sortable: true,
          align: 'right',
          info: 'Shows the balance at the end of the reporting frame. Balance changes during the reporting frame can affect rewards.',
          render: ({ effectiveBalance }) => (
            <FormatToken
              amount={effectiveBalance}
              token={TOKENS.steth}
              trimTrailingZeros
              fallback="—"
            />
          ),
        } as TableColumn<Row>,
      ]
    : []),
];

const getRowKey = (r: Row) =>
  `${r.refSlot}-${r.indexInReport}-${r.validatorIndex}`;
const getRowProps = () => ({ 'data-testid': 'rewardsHistoryRow' }) as object;

export const RewardsHistoryTable: FC = () => {
  const { module } = useModule();
  const { data, sort, setSort } = useTable<Row>();

  const showBalance = !!module && MODULE_PROFILE[module].allocatedBalance;
  const columns = useMemo(() => getColumns(showBalance), [showBalance]);

  return (
    <Table
      columns={columns}
      rows={data}
      rowKey={getRowKey}
      getRowProps={getRowProps}
      minWidth={showBalance ? 960 : 820}
      sort={sort && { key: String(sort.column), direction: sort.direction }}
      onSortChange={({ key, direction }) =>
        setSort({ column: key as keyof Row, direction })
      }
      footer={<TablePagination />}
      dataTestId={{ root: 'rewardsHistoryTable' }}
    />
  );
};
