import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  EnableTopUpAllocationFormInputType,
  EnableTopUpAllocationFormNetworkData,
} from '../context/types';

export const useTxModalStagesEnableTopUpAllocation = () =>
  useTxStages<
    EnableTopUpAllocationFormInputType,
    EnableTopUpAllocationFormNetworkData
  >((transitStage, input) => {
    const description = (
      <>
        Node Operator ID: <b>{input.nodeOperatorId?.toString()}</b>
      </>
    );

    return {
      sign: () =>
        transitStage(
          <TxStageSign
            title="You are enabling top-up allocation"
            description={description}
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title="You are enabling top-up allocation"
            description={description}
          />,
        ),
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess
            txHash={txHash}
            title="Top-up allocation is enabled"
            description={description}
          />,
        ),
    };
  });
