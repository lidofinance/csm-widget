import {
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@lidofinance/lido-app-ui';
import {
  CurveParameters,
  NodeOperatorInfo,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { FC, useMemo } from 'react';
import { useModule } from 'modules/web3';
import { FormatToken } from 'shared/formatters';
import {
  formatPercent,
  getBondAmountForKey,
  getFeeForKey,
  getQueueTypeForKey,
} from 'utils';
import { TableScroll } from './styles';
import { useWatch } from 'react-hook-form';
import { DepositDataInputType } from './use-parse-deposit-data';
import { useFormData } from '../form-controller';

type FormData = {
  operatorInfo?: NodeOperatorInfo;
  curveParameters?: CurveParameters;
};

export const DepositDataParameters: FC = () => {
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

  return (
    <TableScroll>
      <TableRoot variant="dense">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Key number</TableHeaderCell>
            <TableHeaderCell
              align="right"
              info="A share of the Consensus and Execution layers rewards"
            >
              Fee
            </TableHeaderCell>
            {isCsmFamily && (
              <TableHeaderCell
                align="right"
                info="Priority queue stays ahead of the general queue"
              >
                Queue
              </TableHeaderCell>
            )}
            <TableHeaderCell
              align="right"
              info="Security collateral required per validator key"
            >
              Bond
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keyData.map(
            ({ keyNumber, bondAmount, feePercentage, queueType }) => (
              <TableRow key={keyNumber}>
                <TableCell>#{keyNumber}</TableCell>
                <TableCell align="right">
                  {formatPercent(feePercentage)}
                </TableCell>
                {isCsmFamily && (
                  <TableCell align="right">{queueType}</TableCell>
                )}
                <TableCell align="right">
                  <FormatToken amount={bondAmount} token={TOKENS.eth} />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </TableRoot>
    </TableScroll>
  );
};
