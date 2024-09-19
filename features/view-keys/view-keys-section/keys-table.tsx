import { Address, Tbody, Td, Text, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { KeyLink, Stack, StatusChip } from 'shared/components';
import { HexString } from 'shared/keys';
import { AddressRow, TableStyle } from './styles';
import { useGetKeyStatus } from 'shared/hooks';

type Props = {
  keys?: HexString[];
  offset?: number;
};

export const KeysTable: FC<Props> = ({ keys, offset = 0 }) => {
  const { data: getStatus } = useGetKeyStatus();

  return (
    <TableStyle>
      <Thead>
        <Tr>
          <Th>#</Th>
          <Th>Key</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>

      <Tbody>
        {keys?.map((key, index) => (
          <Tr key={offset + index}>
            <Td>
              <Text size="xxs" color="secondary">
                {offset + index + 1}
              </Text>
            </Td>
            <Td>
              <AddressRow>
                <Address address={key} symbols={16} />
                <KeyLink pubkey={key} />
              </AddressRow>
            </Td>
            <Td>
              <Stack direction="column" gap="xs">
                {getStatus?.(key, offset + index).map((status) => (
                  <StatusChip status={status} key={status} />
                ))}
              </Stack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableStyle>
  );
};
