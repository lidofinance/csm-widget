import {
  CurveParameters,
  NodeOperatorInfo,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { FC, useMemo } from 'react';
import { IconTooltip } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import {
  formatPercent,
  getBondAmountForKey,
  getFeeForKey,
  getQueueTypeForKey,
} from 'utils';
import {
  DataCell,
  HeaderCell,
  TableContainer,
  TableHeader,
  TableRow,
} from './styles';
import { useWatch } from 'react-hook-form';
import { DepositDataInputType } from './use-parse-deposit-data';
import { useFormData } from '../form-controller';

type FormData = {
  operatorInfo?: NodeOperatorInfo;
  curveParameters?: CurveParameters;
};

export const DepositDataParameters: FC = () => {
  const [depositData] = useWatch<DepositDataInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { operatorInfo, curveParameters } = useFormData<FormData>();

  const keyData = useMemo(() => {
    if (!curveParameters) return [];
    return Array.from({ length: depositData.length }, (_, index) => {
      const keyNumber = index + 1;
      const existsKeysCount = operatorInfo
        ? operatorInfo.totalAddedKeys - operatorInfo.totalWithdrawnKeys
        : undefined;
      const addedKeysCount = operatorInfo?.totalAddedKeys;

      return {
        keyNumber,
        bondAmount: getBondAmountForKey(
          keyNumber,
          curveParameters.bondConfig,
          existsKeysCount,
        ),
        feePercentage: getFeeForKey(
          keyNumber,
          curveParameters.rewardsConfig,
          existsKeysCount,
        ),
        queueType: getQueueTypeForKey(
          keyNumber,
          curveParameters.queueConfig,
          addedKeysCount,
        ),
      };
    });
  }, [curveParameters, depositData.length, operatorInfo]);

  return (
    <TableContainer $equal>
      <TableHeader>
        <HeaderCell>Key number</HeaderCell>
        <HeaderCell>
          Fee
          <IconTooltip
            tooltip="A share of the Consensus and Execution layers rewards"
            placement="bottomRight"
          />
        </HeaderCell>
        <HeaderCell>
          Queue
          <IconTooltip
            tooltip="Priority queue stays ahead of the general queue"
            placement="bottomRight"
          />
        </HeaderCell>
        <HeaderCell>
          Bond
          <IconTooltip
            tooltip="Security collateral required per validator key"
            placement="bottomRight"
          />
        </HeaderCell>
      </TableHeader>

      {keyData.map(({ keyNumber, bondAmount, feePercentage, queueType }) => (
        <TableRow key={keyNumber}>
          <DataCell>#{keyNumber}</DataCell>
          <DataCell>{formatPercent(feePercentage)}</DataCell>
          <DataCell>{queueType}</DataCell>
          <DataCell>
            <FormatToken amount={bondAmount} token={TOKENS.eth} />
          </DataCell>
        </TableRow>
      ))}
    </TableContainer>
  );
};
