import {
  TransactionModalTransitStage,
  TxStageFail,
  TxStagePending,
  TxStagePermit,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { ErrorCode, getErrorCode } from 'utils';

const getModalStages = (transitStage: TransactionModalTransitStage) => ({
  sign: () => transitStage(<TxStagePermit />),

  pending: () =>
    transitStage(
      <TxStagePending
        title="Connecting with backend"
        description="to check signature"
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

  rejected: () =>
    transitStage(
      <TxStageFail title="Sign in failed" code={ErrorCode.DENIED_SIG} />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
