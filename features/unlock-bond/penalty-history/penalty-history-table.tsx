import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { External, Text } from '@lidofinance/lido-ui';
import { SortButton, useTable } from 'providers/table-provider';
import { FC } from 'react';
import { Stack, TxLinkEtherscan } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { formatDate } from 'utils';
import { TableStyle } from './styles';
import { EnrichedPenalty } from './types';

export const PenaltyHistoryTable: FC = () => {
  const { data } = useTable<EnrichedPenalty>();

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>
            <SortButton column="timestamp">Date</SortButton>
          </th>
          <th>
            <SortButton column="typeLabel">Type</SortButton>
          </th>
          <th>
            <SortButton column="additionalFine">Additional fine</SortButton>
          </th>
          <th>
            <SortButton column="amount">Penalty sum</SortButton>
          </th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record) => (
          <tr key={`${record.transactionHash}-${record.type}`}>
            <td>
              <Stack center gap="xs">
                {formatDate(record.timestamp, 'dd.MM.yyyy')}
                <TxLinkEtherscan
                  txHash={record.transactionHash}
                  text={<External />}
                />
              </Stack>
              {/* {record.details && <RowDetails>{record.details}</RowDetails>} */}
            </td>
            <td>{record.typeLabel}</td>
            <td>
              {(record.additionalFine !== undefined && (
                <Text size="xxs" color={'error'}>
                  <FormatToken
                    amount={record.additionalFine}
                    token={TOKENS.eth}
                  />
                </Text>
              )) || <>&mdash;</>}
            </td>
            <td>
              <Text
                size="xxs"
                color={
                  record.type === 'compensated'
                    ? 'success'
                    : record.type === 'reported'
                      ? 'error'
                      : 'warning'
                }
              >
                <FormatToken amount={record.amount} token={TOKENS.eth} />
              </Text>
            </td>
            <td>
              {record.details && (
                <Text color="secondary" size="xxs">
                  {record.details}
                </Text>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
