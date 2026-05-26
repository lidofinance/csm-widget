import { OperatorWithLockedBond, TOKENS } from '@lidofinance/lido-csm-sdk';
import { SortButton, useTable } from 'providers/table-provider';
import { FC } from 'react';
import { Stack, StatusChip } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { formatDate, isDayInPast } from 'utils';
import { TableStyle } from './styles';

export const LockedTable: FC = () => {
  const { data } = useTable<OperatorWithLockedBond>();

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>
            <SortButton column="nodeOperatorId">Node Operator ID</SortButton>
          </th>
          <th>
            <SortButton column="locked">Locked bond amount</SortButton>
          </th>
          <th>
            <SortButton column="until">Expires</SortButton>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ nodeOperatorId, locked, until }) => (
          <tr key={nodeOperatorId.toString()}>
            <td data-testid="nodeOperatorIdCell">
              {nodeOperatorId.toString()}
            </td>
            <td data-testid="lockedAmountCell">
              <FormatToken amount={locked} token={TOKENS.eth} />
            </td>
            <td data-testid="expiresCell">
              <Stack gap="sm" align="center">
                {formatDate(until, 'dd.MM.yyyy')}
                {isDayInPast(until) && (
                  <StatusChip variant="warning" squared>
                    Expired
                  </StatusChip>
                )}
              </Stack>
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
