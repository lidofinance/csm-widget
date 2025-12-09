import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { SortButton, useTable } from 'providers/table-provider';
import {
  PriorityChip,
  Pubkey,
  PubkeyLinks,
  Stack,
  StatusChip,
  StatusComment,
} from 'shared/components';
import { useMaxPriorityKeyIndex } from 'shared/hooks';
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
          <th>
            <SortButton column="strikes">Strikes</SortButton>
          </th>
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
            <td data-testid="strikesCountCell">
              <StrikesCount strikes={key.strikes} />
            </td>
            <td data-testid="statusCommentCell">
              <StatusComment statuses={key.statuses} />
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
