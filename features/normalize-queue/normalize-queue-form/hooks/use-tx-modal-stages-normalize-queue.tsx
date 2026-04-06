import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
} from 'shared/transaction-modal';
import { useTxCallbackStages } from 'shared/hook-form/form-controller';
import {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from '../context/types';

const getKeysCount = (data: NormalizeQueueFormNetworkData) =>
  data.info.depositableValidatorsCount - data.info.enqueuedCount;

const getTxModalStagesNormalizeQueue = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (
    _input: NormalizeQueueFormInputType,
    data: NormalizeQueueFormNetworkData,
  ) => {
    const keysCount = getKeysCount(data);
    transitStage(
      <TxStageSign
        title="You are normalizing queue"
        description={`Placing ${keysCount} keys(s) it the depositing queue`}
      />,
    );
  },

  pending: (
    _input: NormalizeQueueFormInputType,
    data: NormalizeQueueFormNetworkData,
    txHash?: string,
  ) => {
    const keysCount = getKeysCount(data);
    transitStage(
      <TxStagePending
        title="You are normalizing queue"
        description={`Placing ${keysCount} keys(s) it the depositing queue`}
        txHash={txHash}
      />,
    );
  },

  success: (
    _input: NormalizeQueueFormInputType,
    data: NormalizeQueueFormNetworkData,
    _result: undefined,
    txHash?: string,
  ) => {
    const keysCount = getKeysCount(data);
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Queue has been noramlized"
        description={`You have ${keysCount} keys(s) in depositing queue`}
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalStagesNormalizeQueue = () =>
  useTxCallbackStages<
    NormalizeQueueFormInputType,
    NormalizeQueueFormNetworkData
  >(getTxModalStagesNormalizeQueue);
