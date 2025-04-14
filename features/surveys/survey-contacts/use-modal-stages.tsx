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
        title="Submitting contact info"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(
      <TxStageSuccess title="Contact info submitted" description="" />,
    ),

  confirmRemove: () => transitStage(<></>),

  pendingRemove: () =>
    transitStage(
      <TxStagePending
        title="Deleting contact info"
        description="sending to server"
      />,
    ),

  successRemove: () =>
    transitStage(
      <TxStageSuccess title="Contact info deleted" description="" />,
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
