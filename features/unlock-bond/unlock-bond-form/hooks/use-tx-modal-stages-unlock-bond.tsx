import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TransactionModalTransitStage,
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSignOperationAmount,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  amount?: bigint;
};

const getTxModalStagesUnlockBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ amount }: Props) =>
    amount !== undefined
      ? transitStage(
          <TxStageSignOperationAmount
            operationText="Unlocking"
            amount={amount}
            token={TOKENS.eth}
          />,
        )
      : transitStage(
          <TxStageSign
            title="Unlocking expired bond"
            description="Unlocking your expired bond lock"
          />,
        ),

  pending: ({ amount }: Props, txHash?: string) =>
    amount !== undefined
      ? transitStage(
          <TxStageSignOperationAmount
            operationText="Unlocking"
            amount={amount}
            token={TOKENS.eth}
            isPending
            txHash={txHash}
          />,
        )
      : transitStage(
          <TxStagePending title="Unlocking expired bond" txHash={txHash} />,
        ),

  success: ({ lockedBond }: { lockedBond?: bigint }, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          lockedBond
            ? 'Bond has been partially unlocked'
            : 'Bond has been completely unlocked'
        }
        description={
          lockedBond ? (
            <>
              Remaining locked bond{' '}
              <TxAmount amount={lockedBond} token={TOKENS.eth} />
            </>
          ) : undefined
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
