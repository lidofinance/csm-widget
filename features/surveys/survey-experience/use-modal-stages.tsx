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

  failed: (error: unknown) =>
    transitStage(
      <TxStageFail
        title="Sign in failed"
        error={typeof error === 'string' ? error : undefined}
        code={getErrorCode(error)}
      />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
