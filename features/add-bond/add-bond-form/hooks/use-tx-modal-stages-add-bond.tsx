import type { BigNumber } from 'ethers';

import { TOKENS } from 'consts/tokens';
import {
  TransactionModalTransitStage,
  TxStageOperationSucceedBalanceShown,
  TxStageSignOperationAmount,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

const STAGE_OPERATION_ARGS = {
  operationText: 'Adding Bond',
};

const getTxModalStagesAddBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (amount: BigNumber, token: TOKENS) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
      />,
    ),

  pending: (amount: BigNumber, token: TOKENS, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
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
        balanceToken={'stETH'}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesAddBond = () => {
  return useTransactionModalStage(getTxModalStagesAddBond);
};
