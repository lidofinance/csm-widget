import { Address, Body, DataListRow, Divider } from '@lidofinance/lido-app-ui';
import { useCurveParameters } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { useWatch } from 'react-hook-form';
import { EtherscanAddressLink } from 'shared/components';
import {
  formatEthKeyIntervals,
  formatPercentKeyIntervals,
} from 'shared/components/parameters-list/format';
import { useCurveMetadata } from 'shared/hooks';
import {
  type CuratedOperatorFormInputType,
  useCuratedOperatorFormData,
} from '../context';
import {
  AddressValueStyle,
  CompactListStyle,
  ParamLinesStyle,
  SummaryStyle,
} from './styles';

const SummaryAddress: FC<{ address?: string }> = ({ address }) =>
  address ? (
    <AddressValueStyle>
      <Address address={address} symbols={0} copy />
      <EtherscanAddressLink address={address} />
    </AddressValueStyle>
  ) : (
    <>—</>
  );

const ParamLines: FC<{ items: ReactNode[] }> = ({ items }) => (
  <ParamLinesStyle>
    {items.map((item, index) => (
      <span key={index}>{item}</span>
    ))}
  </ParamLinesStyle>
);

export const VerificationSummary: FC = () => {
  const { availableGates = [] } = useCuratedOperatorFormData();
  const [gateName, rewardAddress, managerAddress, name, description] = useWatch<
    CuratedOperatorFormInputType,
    ['gateName', 'rewardAddress', 'managerAddress', 'name', 'description']
  >({
    name: [
      'gateName',
      'rewardAddress',
      'managerAddress',
      'name',
      'description',
    ],
  });

  const selectedGate = availableGates.find(
    (gate) => gate.gateName === gateName,
  );
  const { data: parameters } = useCurveParameters(selectedGate?.curve);
  const metadata = useCurveMetadata(selectedGate?.curve);

  return (
    <SummaryStyle>
      <Body as="h2" weight="semibold">
        Node Operator details
      </Body>
      <CompactListStyle>
        <DataListRow
          label="Node Operator type:"
          value={metadata?.name ?? '—'}
          dataTestId={{ root: 'summaryOperatorType' }}
        />
        <DataListRow
          label="Name:"
          value={name}
          dataTestId={{ root: 'summaryName' }}
        />
        <DataListRow
          label="Description:"
          value={description}
          dataTestId={{ root: 'summaryDescription' }}
        />
      </CompactListStyle>
      <Divider />
      <CompactListStyle>
        <DataListRow
          label="Manager Address:"
          value={<SummaryAddress address={managerAddress} />}
          dataTestId={{ root: 'summaryManagerAddress' }}
        />
        <DataListRow
          label="Rewards Address:"
          value={<SummaryAddress address={rewardAddress} />}
          dataTestId={{ root: 'summaryRewardsAddress' }}
        />
      </CompactListStyle>
      <Divider />
      <CompactListStyle>
        <DataListRow
          label="Node Operator reward:"
          value={
            <ParamLines
              items={formatPercentKeyIntervals(parameters?.rewardsConfig)}
            />
          }
        />
        <DataListRow
          label="Bond:"
          value={
            <ParamLines items={formatEthKeyIntervals(parameters?.bondConfig)} />
          }
        />
      </CompactListStyle>
    </SummaryStyle>
  );
};
