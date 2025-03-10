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
        description="sendign to server"
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
        description="sendign to server"
      />,
    ),

  successRemove: () =>
    transitStage(
      <TxStageSuccess title="Contact info deleted" description="" />,
    ),

  failed: (error: unknown) =>
    transitStage(
      <TxStageFail title="Submitting failed" code={getErrorCode(error)} />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
