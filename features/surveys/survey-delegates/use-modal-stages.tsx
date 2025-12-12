import {
  TransactionModalTransitStage,
  TxStageFail,
  TxStagePending,
  TxStageSuccess,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { extractErrorMessage, getErrorCode } from 'utils';

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

  failed: (error: unknown) =>
    transitStage(
      <TxStageFail
        title="Operation failed"
        error={extractErrorMessage(error)}
        code={getErrorCode(error)}
      />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
