import { Tbody, Td, Text, Th, Thead, Tr } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { BeaconchainPubkeyLink } from 'shared/components';
import { AddressRow, TableStyle, TooltipIcon } from './styles';
import { ValidatorStats } from '../types';
import { Tooltip } from '@lidofinance/lido-ui';

interface PerformanceTableProps {
  data: ValidatorStats[];
  threshold: number;
  offset?: number;
}

const tooltips = {
  validator: "Your validator's index",
  attestations:
    'Shows the number of attestations your validator has included compared to the number of attestations assigned to it for the selected range.',
  efficiency:
    "Shows your validator's attestation rate compared to Lido's threshold. Green indicates it's above the average; red means it's below.",
};

export const PerformanceTable: FC<PerformanceTableProps> = ({
  data,
  threshold,
}) => (
  <TableStyle>
    <Thead>
      <Tr>
        <Tooltip placement="top" title={tooltips.validator}>
          <Th>
            Validator <TooltipIcon>?</TooltipIcon>
          </Th>
        </Tooltip>
        <Tooltip placement="top" title={tooltips.attestations}>
          <Th>
            Attestations <TooltipIcon>?</TooltipIcon>
          </Th>
        </Tooltip>
        <Tooltip placement="top" title={tooltips.efficiency}>
          <Th>
            Efficiency <TooltipIcon>?</TooltipIcon>
          </Th>
        </Tooltip>
      </Tr>
    </Thead>

    <Tbody>
      {data?.map((validator, _) => (
        <Tr key={validator.index}>
          <Td>
            <AddressRow>
              <Text size="xxs" color="secondary">
                {validator.index}
              </Text>
              <BeaconchainPubkeyLink pubkey={validator.index.toString()} />
            </AddressRow>
          </Td>
          <Td>
            <Text size="xxs" color="secondary">
              {validator.attestations.included +
                ' / ' +
                validator.attestations.assigned}
            </Text>
          </Td>
          <Td>
            <Text
              size="xxs"
              color={validator.efficiency > threshold ? 'success' : 'error'}
            >
              {validator.efficiency
                ? (Number(validator.efficiency.toFixed(4)) * 100).toFixed(2) +
                  ' %'
                : '-'}
            </Text>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </TableStyle>
);
