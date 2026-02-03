import { Divider, Text } from '@lidofinance/lido-ui';
import { getCurveMetadata } from 'consts/operator-type-metadata';
import { useCurveParameters } from 'modules/web3/';
import { type FC, type ReactNode } from 'react';
import { useWatch } from 'react-hook-form';
import { Address, Stack } from 'shared/components';
import {
  formatEthKeyIntervals,
  formatPercentKeyIntervals,
} from 'shared/components/parameters-list/format';
import styled from 'styled-components';
import type { CuratedOperatorFormInputType } from '../context/';
import { useCuratedOperatorFormData } from '../context/';

const SummaryRow: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <RowStyle>
    <Text size="xs" color="secondary">
      {label}
    </Text>
    <div>{children}</div>
  </RowStyle>
);

export const VerificationSummary: FC = () => {
  const { availableGates = [] } = useCuratedOperatorFormData();
  const [gateIndex, rewardAddress, managerAddress, name, description] =
    useWatch<
      CuratedOperatorFormInputType,
      ['gateIndex', 'rewardAddress', 'managerAddress', 'name', 'description']
    >({
      name: [
        'gateIndex',
        'rewardAddress',
        'managerAddress',
        'name',
        'description',
      ],
    });

  const selectedGate = availableGates.find(
    (gate) => gate.gateIndex === gateIndex,
  );

  const { data: parameters } = useCurveParameters(selectedGate?.curveId);

  return (
    <ListStyle>
      <SummaryRow label="Node Operator type:">
        <Text size="xs">
          {getCurveMetadata(selectedGate?.curveId)?.name ?? '—'}
        </Text>
      </SummaryRow>
      <SummaryRow label="Name:">
        <Text size="xs">{name}</Text>
      </SummaryRow>
      <SummaryRow label="Description:">
        <Text size="xs">{description}</Text>
      </SummaryRow>
      <DividerStyle type="horizontal" />
      <SummaryRow label="Manager Address:">
        <Address monospace address={managerAddress} symbols={0} size="xs" />
      </SummaryRow>
      <SummaryRow label="Rewards Address:">
        <Address address={rewardAddress} symbols={0} size="xs" />
      </SummaryRow>

      <DividerStyle />

      <SummaryRow label="Node Operator reward:">
        <Stack direction="column" gap="xs">
          {formatPercentKeyIntervals(parameters?.rewardsConfig).map(
            (item, i) => (
              <Text key={i} size="xs">
                - {item}
              </Text>
            ),
          )}
        </Stack>
      </SummaryRow>
      <SummaryRow label="Bond:">
        <Stack direction="column" gap="xs">
          {formatEthKeyIntervals(parameters?.bondConfig).map((item, i) => (
            <Text key={i} size="xs">
              - {item}
            </Text>
          ))}
        </Stack>
      </SummaryRow>
    </ListStyle>
  );
};

const ListStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(auto, 364px);
  column-gap: ${({ theme }) => theme.spaceMap.sm}px;
  row-gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

const RowStyle = styled.div`
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: start;
`;

const DividerStyle = styled(Divider)`
  grid-column: 1 / -1;
`;
