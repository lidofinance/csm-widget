import type { BigNumber } from 'ethers';

import { TOKENS } from 'consts/tokens';
import {
  TransactionModalTransitStage,
  TxStageOperationSucceedBalanceShown,
  TxStageSignOperationAmount,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

// TODO: review

const STAGE_OPERATION_ARGS = {
  operationText: 'Unlocking Bond',
};

const getTxModalStagesUnlockBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (amount: BigNumber, token: TOKENS) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        operationText="Unlocking"
        willReceive={amount}
        willReceiveToken={token}
        amount={amount}
        token={token}
      />,
    ),

  pending: (amount: BigNumber, token: TOKENS, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        operationText="Unlocking"
        willReceive={amount}
        willReceiveToken={token}
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),

  success: (balance: BigNumber, token: TOKENS, txHash?: string) =>
    transitStage(
      <TxStageOperationSucceedBalanceShown
        {...STAGE_OPERATION_ARGS}
        txHash={txHash}
        balance={balance}
        balanceToken={token}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesUnlockBond = () => {
  return useTransactionModalStage(getTxModalStagesUnlockBond);
};
