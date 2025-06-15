import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStageSignOperationAmount,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  amount: bigint;
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
        token={TOKENS.eth}
      />,
    ),

  pending: ({ amount }: Props, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={TOKENS.eth}
        isPending
        txHash={txHash}
      />,
    ),

  success: ({ lockedBond }: { lockedBond: bigint }, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          lockedBond > 0n
            ? 'Bond has been partially unlocked'
            : 'Bond has been completely unlocked'
        }
        description={
          lockedBond > 0n && (
            <>
              Remaining locked bond{' '}
              <TxAmount amount={lockedBond} token={TOKENS.eth} />
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
