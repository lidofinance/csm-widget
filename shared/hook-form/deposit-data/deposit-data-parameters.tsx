import { Table, TableColumn, Typography } from '@lidofinance/lido-app-ui';
import {
  CurveParameters,
  NodeOperatorInfo,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { FC, ReactNode, useMemo } from 'react';
import { useModule } from 'modules/web3';
import { FormatToken } from 'shared/formatters';
import {
  formatPercent,
  getBondAmountForKey,
  getFeeForKey,
  getQueueTypeForKey,
} from 'utils';
import { useWatch } from 'react-hook-form';
import { DepositDataInputType } from './use-parse-deposit-data';
import { useFormData } from '../form-controller';

type FormData = {
  operatorInfo?: NodeOperatorInfo;
  curveParameters?: CurveParameters;
};

type KeyRow = {
  keyNumber: number;
  bondAmount: bigint;
  feePercentage: bigint;
  queueType?: string;
};

const getRowKey = ({ keyNumber }: KeyRow) => String(keyNumber);

export type DepositDataParametersProps = {
  highlightFrom?: number;
};

export const DepositDataParameters: FC<DepositDataParametersProps> = ({
  highlightFrom,
}) => {
  const { isCsmFamily } = useModule();
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
        queueType: isCsmFamily
          ? getQueueTypeForKey(
              keyNumber,
              curveParameters.queueConfig,
              addedKeysCount,
            )
          : undefined,
      };
    });
  }, [curveParameters, depositData.length, operatorInfo, isCsmFamily]);

  const columns = useMemo<TableColumn<KeyRow>[]>(() => {
    const cell = (keyNumber: number, content: ReactNode) => (
      <Typography
        color={
          highlightFrom !== undefined && keyNumber > highlightFrom
            ? 'error'
            : undefined
        }
      >
        {content}
      </Typography>
    );

    return [
      {
        key: 'keyNumber',
        header: 'Key number',
        render: ({ keyNumber }) => cell(keyNumber, `#${keyNumber}`),
      },
      {
        key: 'feePercentage',
        header: 'Fee',
        align: 'right',
        info: 'A share of the Consensus and Execution layers rewards',
        render: ({ keyNumber, feePercentage }) =>
          cell(keyNumber, formatPercent(feePercentage)),
      },
      ...(isCsmFamily
        ? [
            {
              key: 'queueType',
              header: 'Queue',
              align: 'right',
              info: 'Priority queue stays ahead of the general queue',
              render: ({ keyNumber, queueType }) => cell(keyNumber, queueType),
            } as TableColumn<KeyRow>,
          ]
        : []),
      {
        key: 'bondAmount',
        header: 'Bond',
        align: 'right',
        info: 'Security collateral required per validator key',
        render: ({ keyNumber, bondAmount }) =>
          cell(
            keyNumber,
            <FormatToken amount={bondAmount} token={TOKENS.eth} />,
          ),
      },
    ];
  }, [highlightFrom, isCsmFamily]);

  return (
    <Table
      variant="dense"
      stickyHeader
      maxHeight={150}
      columns={columns}
      rows={keyData}
      rowKey={getRowKey}
    />
  );
};
