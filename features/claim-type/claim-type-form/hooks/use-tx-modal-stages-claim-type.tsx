import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  getGeneralTransactionModalStages,
  useTransactionModalStage,
} from 'shared/transaction-modal';

type Props = {
  curveId: bigint;
};

const getTxModalStagesClaimType = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (_: Props) =>
    transitStage(
      <TxStageSign
        title="Claiming ICS type"
        description="Please confirm this transaction in your wallet"
      />,
    ),

  pending: (_: Props, txHash?: string) =>
    transitStage(<TxStagePending title="Claiming ICS type" txHash={txHash} />),

  success: (_: Props, txHash?: string) =>
    transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="ICS type has been successfully claimed"
        description=""
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalStagesClaimType = () => {
  return useTransactionModalStage(getTxModalStagesClaimType);
};
