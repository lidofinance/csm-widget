import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  keysCount: number;
};

const getTxModalStagesNormalizeQueue = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ keysCount }: Props) =>
    transitStage(
      <TxStageSign
        title="You are normalizing queue"
        description={`Placing ${keysCount} keys(s) it the depositing queue`}
      />,
    ),

  pending: ({ keysCount }: Props, txHash?: string) =>
    transitStage(
      <TxStagePending
        title="You are normalizing queue"
        description={`Placing ${keysCount} keys(s) it the depositing queue`}
        txHash={txHash}
      />,
    ),

  success: ({ keysCount }: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Queue is noramlized"
        description={`You have ${keysCount} keys(s) in depositing queue`}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesNormalizeQueue = () => {
  return useTransactionModalStage(getTxModalStagesNormalizeQueue);
};
