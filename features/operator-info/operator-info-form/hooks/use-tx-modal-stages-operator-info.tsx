import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

const getTxModalStagesOperatorInfo = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: () =>
    transitStage(
      <TxStageSign
        title="You are updating operator info"
        description="Name and description will be updated"
      />,
    ),

  pending: (txHash?: string) =>
    transitStage(
      <TxStagePending
        title="Updating operator info"
        description="Name and description will be updated"
        txHash={txHash}
      />,
    ),

  success: (txHash?: string) =>
    transitStage(
      <TxStageSuccess
        title="Operator info has been updated"
        description="Name and description have been updated"
        txHash={txHash}
      />,
      { isClosableOnLedger: true },
    ),
});

export const useTxModalStagesOperatorInfo = () =>
  useTransactionModalStage(getTxModalStagesOperatorInfo);
