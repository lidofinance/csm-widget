import { FC } from 'react';
import {
  Address,
  BeaconchainPubkeyLink,
  Stack,
  StatusChip,
  StatusComment,
} from 'shared/components';
import { KeyWithStatus, useSortedKeys } from 'shared/hooks';
import { TableStyle } from './styles';

type Props = {
  keys?: KeyWithStatus[];
};

export const KeysTable: FC<Props> = ({ keys }) => {
  const sortedKeys = useSortedKeys(keys);

  return (
    <TableStyle>
      <thead>
        <tr>
          <th>Key</th>
          <th>Status</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {sortedKeys?.map(({ key, index, statuses }) => (
          <tr key={index}>
            <td>
              <Address
                address={key}
                symbols={8}
                size="xxs"
                link={<BeaconchainPubkeyLink pubkey={key} />}
              />
            </td>
            <td>
              <Stack direction="column" gap="xs">
                {statuses.map((status) => (
                  <StatusChip status={status} key={status} />
                ))}
              </Stack>
            </td>
            <td>
              <StatusComment statuses={statuses} />
            </td>
          </tr>
        ))}
      </tbody>
    </TableStyle>
  );
};
