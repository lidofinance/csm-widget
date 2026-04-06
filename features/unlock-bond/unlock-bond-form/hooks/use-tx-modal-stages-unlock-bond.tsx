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
  lockedBond?: bigint;
  compensationAmount?: bigint;
};

const getTxModalStagesUnlockBond = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ compensationAmount }: Props) =>
    compensationAmount !== undefined
      ? transitStage(
          <TxStageSignOperationAmount
            operationText="Compensating"
            amount={compensationAmount}
            token={TOKENS.steth}
          />,
        )
      : transitStage(
          <TxStageSign
            title="Unlocking expired bond"
            description="Unlocking your expired bond lock"
          />,
        ),

  pending: ({ compensationAmount }: Props, txHash?: string) =>
    compensationAmount !== undefined
      ? transitStage(
          <TxStageSignOperationAmount
            operationText="Compensating"
            amount={compensationAmount}
            token={TOKENS.steth}
            isPending
            txHash={txHash}
          />,
        )
      : transitStage(
          <TxStagePending title="Unlocking expired bond" txHash={txHash} />,
        ),

  success: ({ lockedBond, compensationAmount }: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title={
          compensationAmount !== undefined
            ? lockedBond
              ? 'Locked bond has been partially compensated'
              : 'Locked bond has been fully compensated'
            : 'Expired bond lock has been unlocked'
        }
        description={
          lockedBond ? (
            <>
              Remaining locked bond{' '}
              <TxAmount amount={lockedBond} token={TOKENS.steth} />
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
