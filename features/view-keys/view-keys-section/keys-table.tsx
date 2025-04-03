import { Tbody, Td, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { FC } from 'react';
import {
  Address,
  BeaconchainPubkeyLink,
  Stack,
  StatusChip,
  StatusComment,
} from 'shared/components';
import { KeyWithStatus, useSortedKeys } from 'shared/hooks';
import { AddressRow, TableStyle } from './styles';

type Props = {
  keys?: KeyWithStatus[];
};

export const KeysTable: FC<Props> = ({ keys }) => {
  const sortedKeys = useSortedKeys(keys);

  return (
    <TableStyle>
      <Thead>
        <Tr>
          <Th>Key</Th>
          <Th>Status</Th>
          <Th>Comment</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedKeys?.map(({ key, index, statuses }) => (
          <Tr key={index}>
            <Td>
              <AddressRow>
                <Address
                  address={key}
                  symbols={8}
                  link={<BeaconchainPubkeyLink pubkey={key} />}
                />
              </AddressRow>
            </Td>
            <Td>
              <Stack direction="column" gap="xs">
                {statuses.map((status) => (
                  <StatusChip status={status} key={status} />
                ))}
              </Stack>
            </Td>
            <Td>
              <StatusComment statuses={statuses} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableStyle>
  );
};
