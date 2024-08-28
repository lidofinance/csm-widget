import type { BigNumber } from 'ethers';

import { TOKENS } from 'consts/tokens';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStageSignOperationAmount,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  amount: BigNumber;
};

const getTxModalStagesUnlockBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ amount }: Props) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={TOKENS.ETH}
      />,
    ),

  pending: ({ amount }: Props, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={TOKENS.ETH}
        isPending
        txHash={txHash}
      />,
    ),

  success: ({ lockedBond }: { lockedBond: BigNumber }, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          lockedBond.gt(0)
            ? 'Bond are partially unlocked'
            : 'Bond are completely unlocked'
        }
        description={
          lockedBond.gt(0) && (
            <>
              Remaining locked bond{' '}
              <TxAmount amount={lockedBond} token={TOKENS.ETH} />
            </>
          )
        }
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesUnlockBond = () => {
  return useTransactionModalStage(getTxModalStagesUnlockBond);
};
