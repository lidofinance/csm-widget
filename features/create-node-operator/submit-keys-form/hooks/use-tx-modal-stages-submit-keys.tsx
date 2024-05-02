import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

import { TOKENS } from 'consts/tokens';
import type { BigNumber } from 'ethers';
import {
  TxStagePermit,
  TxStageSuccess,
} from 'shared/transaction-modal/tx-stages-basic';
import { TxStageSignOperationKeys } from 'shared/transaction-modal/tx-stages-composed/tx-stage-keys-operation';
import { NodeOperatorId } from 'types';

const STAGE_OPERATION_ARGS = {
  operationText: 'Uploading',
};

const getTxModalStagesSubmitKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  signPermit: () => transitStage(<TxStagePermit />),

  sign: (keysCount: number, amount: BigNumber, token: TOKENS) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
        keysCount={keysCount}
      />,
    ),

  pending: (
    keysCount: number,
    amount: BigNumber,
    token: TOKENS,
    txHash?: string,
  ) =>
    transitStage(
      <TxStageSignOperationKeys
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
        keysCount={keysCount}
        isPending
        txHash={txHash}
      />,
    ),

  success: (nodeOperatorId?: NodeOperatorId, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={<>Your keys are uploaded</>}
        description={
          nodeOperatorId ? (
            <>Your NodeOperator ID is {nodeOperatorId}</>
          ) : undefined
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesSubmitKeys = () => {
  return useTransactionModalStage(getTxModalStagesSubmitKeys);
};
