import { type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useMemo } from 'react';
import { buildTxCallback } from 'shared/hook-form/form-controller';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransitStage,
} from 'shared/transaction-modal';
import {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from '../context/types';

const getKeysCount = (data: NormalizeQueueFormNetworkData) =>
  data.info.depositableValidatorsCount - data.info.enqueuedCount;

export const useTxModalStagesNormalizeQueue = (): ((
  input: NormalizeQueueFormInputType,
  data: NormalizeQueueFormNetworkData,
  onRetry: () => void,
) => TransactionCallback) => {
  const transitStage = useTransitStage();

  return useMemo(
    () =>
      (
        _input: NormalizeQueueFormInputType,
        data: NormalizeQueueFormNetworkData,
        onRetry: () => void,
      ) => {
        const keysCount = getKeysCount(data);
        return buildTxCallback(
          {
            ...getGeneralTransactionModalStages(transitStage),
            sign: () =>
              transitStage(
                <TxStageSign
                  title="You are normalizing queue"
                  description={`Placing ${keysCount} keys(s) it the depositing queue`}
                />,
              ),
            pending: (txHash) =>
              transitStage(
                <TxStagePending
                  title="You are normalizing queue"
                  description={`Placing ${keysCount} keys(s) it the depositing queue`}
                  txHash={txHash}
                />,
              ),
            success: (_result: undefined, txHash) =>
              transitStage(
                <TxStageSuccess
                  txHash={txHash}
                  title="Queue has been noramlized"
                  description={`You have ${keysCount} keys(s) in depositing queue`}
                />,
                { isClosableOnLedger: true },
              ),
          },
          onRetry,
        );
      },
    [transitStage],
  );
};
