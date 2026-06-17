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
        title="Submitting your validation experience"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(
      <TxStageSuccess
        title="Your validation experience submitted"
        description=""
      />,
    ),

  failed: getFailedStage(transitStage, 'Submission failed'),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
