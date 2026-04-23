import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  NormalizeQueueFormInputType,
  NormalizeQueueFormNetworkData,
} from '../context/types';

const getKeysCount = (data: NormalizeQueueFormNetworkData) =>
  data.info.depositableValidatorsCount - data.info.enqueuedCount;

export const useTxModalStagesNormalizeQueue = () =>
  useTxStages<NormalizeQueueFormInputType, NormalizeQueueFormNetworkData>(
    (transitStage, _input, data) => {
      const keysCount = getKeysCount(data);
      return {
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
      };
    },
  );
