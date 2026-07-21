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
        title="Adding delegate"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(<TxStageSuccess title="Delegate added" description="" />),

  pendingRemove: () =>
    transitStage(
      <TxStagePending
        title="Removing delegate"
        description="sending to server"
      />,
    ),

  successRemove: () =>
    transitStage(<TxStageSuccess title="Delegate removed" description="" />),

  failed: getFailedStage(transitStage, 'Operation failed'),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
