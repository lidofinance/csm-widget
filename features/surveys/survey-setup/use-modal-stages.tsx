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
        title="Submitting Setup"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(<TxStageSuccess title="Setup submitted" description="" />),

  confirmRemove: () => transitStage(<></>),

  pendingRemove: () =>
    transitStage(
      <TxStagePending title="Deleting Setup" description="sending to server" />,
    ),

  successRemove: () =>
    transitStage(<TxStageSuccess title="Setup deleted" description="" />),

  failed: (error: unknown) =>
    transitStage(
      <TxStageFail title="Submitting failed" code={getErrorCode(error)} />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
