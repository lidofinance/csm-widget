import { TOKENS } from 'consts/tokens';
import type { BigNumber } from 'ethers';
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
  operationText: 'Uploading',
};

const getTxModalStagesAddKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (
    keysCount: number,
    amount: BigNumber,
    token: TOKENS,
    nodeOperatorId: NodeOperatorId,
  ) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
        keysCount={keysCount}
        nodeOperatorId={nodeOperatorId}
      />,
    ),

  pending: (
    keysCount: number,
    amount: BigNumber,
    token: TOKENS,
    nodeOperatorId: NodeOperatorId,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
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
        title={<>Your keys are uploaded</>}
        description={<SuccessText {...STAGE_OPERATION_ARGS} />}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesAddKeys = () => {
  return useTransactionModalStage(getTxModalStagesAddKeys);
};
