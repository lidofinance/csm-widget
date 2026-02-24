import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

const getTxModalStagesMetadata = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: () =>
    transitStage(
      <TxStageSign
        title="You are updating metadata"
        description="Name and description will be updated"
      />,
    ),

  pending: (txHash?: string) =>
    transitStage(
      <TxStagePending
        title="Updating metadata"
        description="Name and description will be updated"
        txHash={txHash}
      />,
    ),

  success: (txHash?: string) =>
    transitStage(
      <TxStageSuccess
        title="Metadata has been updated"
        description="Name and description have been updated"
        txHash={txHash}
      />,
      { isClosableOnLedger: true },
    ),
});

export const useTxModalStagesMetadata = () =>
  useTransactionModalStage(getTxModalStagesMetadata);
