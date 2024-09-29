import { Tbody, Td, Text, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { LockedOperator } from 'shared/hooks';
import { TableStyle } from './styles';

type Props = {
  data?: LockedOperator[];
  offset?: number;
};

export const LockedTable: FC<Props> = ({ data, offset = 0 }) => (
  <Stack direction="column">
    <TableStyle>
      <Thead>
        <Tr>
          <Th>Node Operarod ID</Th>
          <Th>Locked bond amount</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map(([id, amount], index) => (
          <Tr key={offset + index}>
            <Td>
              <Text size="xxs" color="secondary">
                {id}
              </Text>
            </Td>
            <Td>
              <FormatToken amount={amount} token={TOKENS.ETH} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableStyle>
  </Stack>
);
