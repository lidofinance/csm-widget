import {
  type AddBondResult,
  TOKENS,
  type TransactionCallback,
} from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxStageOperationSucceedBalanceShown,
  TxStageSignOperationAmount,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import { AddBondFormInputType, AddBondFormNetworkData } from '../context/types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Adding Bond',
};

export const useTxModalStagesAddBond = (): ((
  input: AddBondFormInputType,
  data: AddBondFormNetworkData,
  onRetry: () => void,
) => TransactionCallback<AddBondResult>) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: AddBondFormInputType,
        _data: AddBondFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback<AddBondResult>(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSignOperationAmount
                  {...STAGE_OPERATION_ARGS}
                  amount={input.bondAmount ?? 0n}
                  token={input.token}
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStageSignOperationAmount
                  {...STAGE_OPERATION_ARGS}
                  amount={input.bondAmount ?? 0n}
                  token={input.token}
                  isPending
                  txHash={txHash}
                />,
              ),
            success: (result: AddBondResult, txHash) =>
              transitStage(
                <TxStageOperationSucceedBalanceShown
                  {...STAGE_OPERATION_ARGS}
                  txHash={txHash}
                  balance={result.current}
                  balanceToken={TOKENS.steth}
                />,
                { isClosableOnLedger: true },
              ),
          },
          onRetry,
        ),
    [transitStage],
  );
};
