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

type Props = {
  amount: BigNumber;
  token: TOKENS;
};

const getTxModalStagesAddBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ amount, token }: Props) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
      />,
    ),

  pending: ({ amount, token }: Props, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        {...STAGE_OPERATION_ARGS}
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),

  success: ({ balance }: { balance: BigNumber }, txHash?: string) =>
    transitStage(
      <TxStageOperationSucceedBalanceShown
        {...STAGE_OPERATION_ARGS}
        txHash={txHash}
        balance={balance}
        balanceToken={TOKENS.STETH}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesAddBond = () => {
  return useTransactionModalStage(getTxModalStagesAddBond);
};
