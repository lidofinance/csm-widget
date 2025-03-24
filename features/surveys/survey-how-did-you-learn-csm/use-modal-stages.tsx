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
        title="Submitting form"
        description="sending to server"
      />,
    ),

  success: () =>
    transitStage(<TxStageSuccess title="Form submitted" description="" />),

  failed: (error: unknown) =>
    transitStage(
      <TxStageFail title="Submitting failed" code={getErrorCode(error)} />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
