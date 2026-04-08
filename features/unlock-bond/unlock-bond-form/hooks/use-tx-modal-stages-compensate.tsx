import { TOKENS, type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxAmount,
  TxStageSignOperationAmount,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
} from '../context/types';

type TxResult = bigint | undefined;

export const useTxModalStagesCompensate = (): ((
  input: UnlockBondFormInputType,
  data: UnlockBondFormNetworkData,
  onRetry: () => void,
) => TransactionCallback<TxResult>) => {
  const transitStage = useTransitStage();

  return useMemo(
    () => (_input, data, onRetry: () => void) =>
      buildTxCallback<TxResult>(
        {
          ...getGeneralTransactionModalStages(transitStage),
          sign: () =>
            transitStage(
              <TxStageSignOperationAmount
                operationText="Compensating"
                amount={data.compensationAmount}
                token={TOKENS.steth}
              />,
            ),
          pending: (txHash) =>
            transitStage(
              <TxStageSignOperationAmount
                operationText="Compensating"
                amount={data.compensationAmount}
                token={TOKENS.steth}
                isPending
                txHash={txHash}
              />,
            ),
          success: (result: TxResult, txHash) =>
            transitStage(
              <TxStageSuccess
                txHash={txHash}
                title={
                  result
                    ? 'Locked bond has been partially compensated'
                    : 'Locked bond has been fully compensated'
                }
                description={
                  result ? (
                    <>
                      Remaining locked bond{' '}
                      <TxAmount amount={result} token={TOKENS.steth} />
                    </>
                  ) : undefined
                }
              />,
              { isClosableOnLedger: true },
            ),
        },
        onRetry,
      ),
    [transitStage],
  );
};
