import {
  TransactionModalTransitStage,
  TxStagePending,
  TxStageSuccess,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { getFailedStage } from 'shared/transaction-modal/hooks';

const getModalStages = (transitStage: TransactionModalTransitStage) => ({
  pending: () =>
    transitStage(
      <TxStagePending
        title="Submitting form"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(<TxStageSuccess title="Form submitted" description="" />),

  failed: getFailedStage(transitStage, 'Submission failed'),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
