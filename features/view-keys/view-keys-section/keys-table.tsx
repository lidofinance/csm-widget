import { Address, Tbody, Td, Text, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { KeyLink, Stack, StatusChip } from 'shared/components';
import { KeyWithStatus } from 'shared/hooks';
import { AddressRow, TableStyle } from './styles';

type Props = {
  data?: KeyWithStatus[];
  offset?: number;
};

export const KeysTable: FC<Props> = ({ data, offset = 0 }) => (
  <TableStyle>
    <Thead>
      <Tr>
        <Th>#</Th>
        <Th>Key</Th>
        <Th>Status</Th>
      </Tr>
    </Thead>

    <Tbody>
      {data?.map(({ key, statuses }, index) => (
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
              {statuses.map((status) => (
                <StatusChip status={status} key={status} />
              ))}
            </Stack>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </TableStyle>
);
