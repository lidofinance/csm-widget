import {
  IconLink,
  Stack,
  Table,
  TableColumn,
  Typography,
} from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useTable } from 'providers/table-provider';
import { FC } from 'react';
import { TxLinkEtherscan } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { formatDate } from 'utils';
import { EnrichedPenalty } from './types';

const INHERIT_FONT = { font: 'inherit' };

const COLUMNS: TableColumn<EnrichedPenalty>[] = [
  {
    key: 'timestamp',
    header: 'Date',
    sortable: true,
    render: ({ timestamp, transactionHash }) => (
      <Stack direction="row" align="center" gap={4}>
        {formatDate(timestamp, 'dd.MM.yyyy')}
        <TxLinkEtherscan txHash={transactionHash} text={<IconLink />} />
      </Stack>
    ),
  },
  {
    key: 'typeLabel',
    header: 'Type',
    sortable: true,
    render: ({ typeLabel }) => <span data-testid="typeCell">{typeLabel}</span>,
  },
  {
    key: 'additionalFine',
    header: 'Additional fine',
    sortable: true,
    align: 'right',
    render: ({ additionalFine }) =>
      additionalFine !== undefined ? (
        <Typography as="span" color="error" style={INHERIT_FONT}>
          <FormatToken amount={additionalFine} token={TOKENS.steth} />
        </Typography>
      ) : (
        <>&mdash;</>
      ),
  },
  {
    key: 'amount',
    header: 'Penalty sum',
    sortable: true,
    align: 'right',
    render: ({ type, amount }) => (
      <Typography
        as="span"
        color={
          type === 'compensated'
            ? 'success'
            : type === 'reported'
              ? 'error'
              : 'warning'
        }
        style={INHERIT_FONT}
        dataTestId={{ root: 'amountCell' }}
      >
        <FormatToken amount={amount} token={TOKENS.steth} />
      </Typography>
    ),
  },
  {
    key: 'details',
    header: 'Details',
    render: ({ details }) =>
      details ? (
        <Typography
          as="span"
          color="secondary"
          style={INHERIT_FONT}
          dataTestId={{ root: 'detailsCell' }}
        >
          {details}
        </Typography>
      ) : null,
  },
];

const getRowKey = ({ transactionHash, type }: EnrichedPenalty) =>
  `${transactionHash}-${type}`;
const getRowProps = () => ({ 'data-testid': 'penaltyHistoryRow' }) as object;

export const PenaltyHistoryTable: FC = () => {
  const { data, sort, setSort } = useTable<EnrichedPenalty>();

  return (
    <Table
      columns={COLUMNS}
      rows={data}
      rowKey={getRowKey}
      getRowProps={getRowProps}
      sort={sort && { key: String(sort.column), direction: sort.direction }}
      onSortChange={({ key, direction }) =>
        setSort({ column: key as keyof EnrichedPenalty, direction })
      }
    />
  );
};
