import {
  TableAlign,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
  Typography,
} from '@lidofinance/lido-app-ui';
import {
  CurveParameters,
  NodeOperatorInfo,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren, useMemo } from 'react';
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

type ParameterCellProps = PropsWithChildren<{
  align?: TableAlign;
  error: boolean;
}>;

const ParameterCell: FC<ParameterCellProps> = ({ align, error, children }) => (
  <TableCell align={align}>
    <Typography color={error ? 'error' : undefined}>{children}</Typography>
  </TableCell>
);

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
            ({ keyNumber, bondAmount, feePercentage, queueType }, index) => {
              const error =
                highlightFrom !== undefined && index >= highlightFrom;
              return (
                <TableRow key={keyNumber}>
                  <ParameterCell error={error}>#{keyNumber}</ParameterCell>
                  <ParameterCell align="right" error={error}>
                    {formatPercent(feePercentage)}
                  </ParameterCell>
                  {isCsmFamily && (
                    <ParameterCell align="right" error={error}>
                      {queueType}
                    </ParameterCell>
                  )}
                  <ParameterCell align="right" error={error}>
                    <FormatToken amount={bondAmount} token={TOKENS.eth} />
                  </ParameterCell>
                </TableRow>
              );
            },
          )}
        </TableBody>
      </TableRoot>
    </TableScroll>
  );
};
