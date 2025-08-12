import {
  TransactionModalTransitStage,
  TxStageFail,
  TxStagePending,
  TxStageSuccess,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { getErrorCode } from 'utils';

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
        description="The assessment process typically takes about two weeks. You can track your application’s status on the Operator Type tab."
      />,
    ),

  failed: (error: unknown, onRetry?: () => void) =>
    transitStage(
      <TxStageFail
        title="Something went wrong"
        error={typeof error === 'string' ? error : undefined}
        code={getErrorCode(error)}
        onRetry={onRetry}
      />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
