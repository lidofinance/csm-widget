import { Tbody, Td, Text, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { TableStyle } from './styles';
import { OperatorWithLockedBond, TOKENS } from '@lidofinance/lido-csm-sdk';

type Props = {
  data?: OperatorWithLockedBond[];
  offset?: number;
};

export const LockedTable: FC<Props> = ({ data, offset = 0 }) => (
  <Stack direction="column">
    <TableStyle>
      <Thead>
        <Tr>
          <Th>Node Operator ID</Th>
          <Th>Locked bond amount</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map(({ nodeOperatorId, locked }, index) => (
          <Tr key={offset + index}>
            <Td>
              <Text size="xxs" color="secondary">
                {nodeOperatorId.toString()}
              </Text>
            </Td>
            <Td>
              <FormatToken amount={locked} token={TOKENS.eth} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableStyle>
  </Stack>
);
