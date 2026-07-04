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

  failed: getFailedStage(transitStage, 'Submission failed'),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
