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
        {data.map(({ pubkey, index, statuses, strikes, validatorIndex }) => (
          <tr key={index}>
            <td data-testid="pubkeyCell">
              <Pubkey
                pubkey={pubkey}
                link={<PubkeyLinks {...{ pubkey, validatorIndex }} />}
              />
            </td>
            <td data-testid="statusCell">
              <Stack direction="column" gap="xs">
                {statuses.map((status) => (
                  <StatusChip
                    status={status}
                    key={status}
                    suffix={
                      status === KEY_STATUS.DEPOSITABLE &&
                      index <= maxPriorityKeyIndex ? (
                        <PriorityChip />
                      ) : null
                    }
                  />
                ))}
              </Stack>
            </td>
            <td data-testid="strikesCountCell">
              <StrikesCount strikes={strikes} />
            </td>
            <td data-testid="statusCommentCell">
              <StatusComment statuses={statuses} />
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
