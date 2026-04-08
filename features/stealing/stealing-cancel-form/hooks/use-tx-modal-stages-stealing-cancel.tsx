import { type TransactionCallback, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  StealingCancelFormInputType,
  StealingCancelFormNetworkData,
} from '../context/types';

export const useTxModalStagesStealingCancel = (): ((
  input: StealingCancelFormInputType,
  data: StealingCancelFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: StealingCancelFormInputType,
        _data: StealingCancelFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="You are canceling stealing"
                  description={
                    <>
                      Node Operator ID:{' '}
                      <b>{input.nodeOperatorId?.toString()}</b>
                      <br />
                      Amount:{' '}
                      <TxAmount
                        amount={input.amount ?? 0n}
                        token={TOKENS.eth}
                      />
                    </>
                  }
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending
                  txHash={txHash}
                  title="You are canceling stealing"
                  description={
                    <>
                      Node Operator ID:{' '}
                      <b>{input.nodeOperatorId?.toString()}</b>
                      <br />
                      Amount:{' '}
                      <TxAmount
                        amount={input.amount ?? 0n}
                        token={TOKENS.eth}
                      />
                    </>
                  }
                />,
              ),
            success: (_result: undefined, txHash) =>
              transitStage(
                <TxStageSuccess
                  txHash={txHash}
                  title="Stealing is canceled"
                  description={
                    <>
                      Node Operator ID:{' '}
                      <b>{input.nodeOperatorId?.toString()}</b>
                      <br />
                      Amount:{' '}
                      <TxAmount
                        amount={input.amount ?? 0n}
                        token={TOKENS.eth}
                      />
                    </>
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
