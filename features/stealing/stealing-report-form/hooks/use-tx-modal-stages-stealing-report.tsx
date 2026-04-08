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
  StealingReportFormInputType,
  StealingReportFormNetworkData,
} from '../context/types';

export const useTxModalStagesStealingReport = (): ((
  input: StealingReportFormInputType,
  data: StealingReportFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        input: StealingReportFormInputType,
        _data: StealingReportFormNetworkData,
        onRetry: () => void,
      ) =>
        buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="You are reporting stealing"
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
                  title="You are reporting stealing"
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
                  title="Stealing is reported"
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
