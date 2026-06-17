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
        title="Submitting your application form"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(
      <TxStageSuccess
        title="Your application has been submitted"
        description="You can track your application's status on the Operator Type tab."
      />,
    ),

  failed: getFailedStage(transitStage, 'Submission failed', {
    isClosableOnLedger: true,
  }),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
