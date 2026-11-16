import { Stack, Table, Tag, TableColumn } from '@lidofinance/lido-app-ui';
import { OperatorWithLockedBond, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useTable } from 'providers/table-provider';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { formatDate, isDayInPast } from 'utils';

type Row = OperatorWithLockedBond;

const COLUMNS: TableColumn<Row>[] = [
  {
    key: 'nodeOperatorId',
    header: 'Node Operator ID',
    sortable: true,
    render: ({ nodeOperatorId }) => (
      <span data-testid="nodeOperatorIdCell">{nodeOperatorId.toString()}</span>
    ),
  },
  {
    key: 'locked',
    header: 'Locked bond amount',
    sortable: true,
    render: ({ locked }) => (
      <span data-testid="lockedAmountCell">
        <FormatToken amount={locked} token={TOKENS.eth} />
      </span>
    ),
  },
  {
    key: 'until',
    header: 'Expires',
    sortable: true,
    render: ({ until }) => (
      <Stack direction="row" align="center" gap={8} data-testid="expiresCell">
        {formatDate(until, 'dd.MM.yyyy')}
        {isDayInPast(until) && <Tag variant="warning">Expired</Tag>}
      </Stack>
    ),
  },
];

const getRowKey = ({ nodeOperatorId }: Row) => nodeOperatorId.toString();
const getRowProps = () => ({ 'data-testid': 'lockedRow' }) as object;

export const LockedTable: FC = () => {
  const { data, sort, setSort } = useTable<Row>();

  return (
    <Table
      columns={COLUMNS}
      rows={data}
      rowKey={getRowKey}
      getRowProps={getRowProps}
      sort={sort && { key: String(sort.column), direction: sort.direction }}
      onSortChange={({ key, direction }) =>
        setSort({ column: key as keyof Row, direction })
      }
    />
  );
};
