import {
  SuccessText,
  TransactionModalTransitStage,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { TxStageSignOperationKeys } from 'shared/transaction-modal/tx-stages-composed/tx-stage-keys-operation';
import { NodeOperatorId } from 'types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Removing',
};

const getTxModalStagesRemoveKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (keysCount: number, nodeOperatorId: NodeOperatorId) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        keysCount={keysCount}
        nodeOperatorId={nodeOperatorId}
      />,
    ),

  pending: (
    keysCount: number,
    nodeOperatorId: NodeOperatorId,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        keysCount={keysCount}
        nodeOperatorId={nodeOperatorId}
        isPending
        txHash={txHash}
      />,
    ),

  success: (txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Your keys are removed</>}
        description={<SuccessText {...STAGE_OPERATION_ARGS} />}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesRemoveKeys = () => {
  return useTransactionModalStage(getTxModalStagesRemoveKeys);
};
