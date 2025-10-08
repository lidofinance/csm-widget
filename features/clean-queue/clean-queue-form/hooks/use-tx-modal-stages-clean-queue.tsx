import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

const getTxModalStagesCleanQueue = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: () =>
    transitStage(
      <TxStageSign
        title="You are cleaning queue"
        description="Removing empty batches from the deposit queue"
      />,
    ),

  pending: (txHash?: string) =>
    transitStage(
      <TxStagePending
        title="You are cleaning queue"
        description="Removing empty batches from the deposit queue"
        txHash={txHash}
      />,
    ),

  success: (txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Queue has been cleaned"
        description="Empty batches have been removed from the deposit queue"
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesCleanQueue = () => {
  return useTransactionModalStage(getTxModalStagesCleanQueue);
};
