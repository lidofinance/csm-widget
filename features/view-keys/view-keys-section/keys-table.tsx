import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { SortButton, useTable } from 'providers/table-provider';
import { FC } from 'react';
import {
  PriorityChip,
  Pubkey,
  PubkeyLinks,
  Stack,
  StatusChip,
  StatusComment,
} from 'shared/components';
import { useMaxPriorityKeyIndex } from 'shared/hooks';
import { Gate } from 'shared/navigate';
import { BalanceCell } from './balance-cell';
import { StrikesCount } from './strikes-counts';
import { TableStyle } from './styles';

export const KeysTable: FC = () => {
  const maxPriorityKeyIndex = useMaxPriorityKeyIndex();
  const { data } = useTable<KeyWithStatus>();

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>
            <SortButton column="pubkey">Key</SortButton>
          </th>
          <th>
            <SortButton column="statuses">Status</SortButton>
          </th>
          <Gate rule="IS_CSM">
            <th>
              <SortButton column="strikes">Strikes</SortButton>
            </th>
          </Gate>
          <Gate rule="IS_CM">
            <th>
              <SortButton column="effectiveBalance">Balance</SortButton>
            </th>
          </Gate>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {data.map((key) => (
          <tr key={key.index}>
            <td data-testid="pubkeyCell">
              <Pubkey pubkey={key.pubkey} link={<PubkeyLinks {...key} />} />
            </td>
            <td data-testid="statusCell">
              <Stack direction="column" gap="xs">
                {key.statuses.map((status) => (
                  <StatusChip
                    status={status}
                    key={status}
                    suffix={
                      status === KEY_STATUS.DEPOSITABLE &&
                      key.index <= maxPriorityKeyIndex ? (
                        <PriorityChip />
                      ) : null
                    }
                  />
                ))}
              </Stack>
            </td>
            <Gate rule="IS_CSM">
              <td data-testid="strikesCountCell">
                <StrikesCount strikes={key.strikes} />
              </td>
            </Gate>
            <Gate rule="IS_CM">
              <td data-testid="balanceCell">
                <BalanceCell effectiveBalance={key.effectiveBalance} />
              </td>
            </Gate>
            <td data-testid="statusCommentCell">
              <StatusComment statuses={key.statuses} />
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
