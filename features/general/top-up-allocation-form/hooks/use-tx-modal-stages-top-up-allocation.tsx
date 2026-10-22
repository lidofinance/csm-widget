import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import type {
  TopUpAllocationFormInputType,
  TopUpAllocationFormNetworkData,
} from '../context/types';

export const useTxModalStagesTopUpAllocation = () =>
  useTxStages<TopUpAllocationFormInputType, TopUpAllocationFormNetworkData>(
    (transitStage) => ({
      sign: () =>
        transitStage(
          <TxStageSign
            title="You are disabling top-ups"
            description="Top-up deposits will be disabled for your Node Operator"
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            title="Disabling top-ups"
            description="Top-up deposits will be disabled for your Node Operator"
            txHash={txHash}
          />,
        ),
      success: (_result: undefined, txHash) =>
        transitStage(
          <TxStageSuccess
            title="Top-ups have been disabled"
            description="Top-up deposits have been disabled for your Node Operator"
            txHash={txHash}
          />,
        ),
    }),
  );
