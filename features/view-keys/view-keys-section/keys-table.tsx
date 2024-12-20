import { Address, Tbody, Td, Text, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { KeyLink, Stack, StatusChip, StatusComment } from 'shared/components';
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
          <Th>#</Th>
          <Th>Key</Th>
          <Th>Status</Th>
          <Th>Comment</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedKeys?.map(({ key, index, statuses }) => (
          <Tr key={index}>
            <Td>
              <Text size="xxs" color="secondary">
                {index + 1}
              </Text>
            </Td>
            <Td>
              <AddressRow>
                <Address address={key} symbols={8} />
                <KeyLink pubkey={key} />
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
