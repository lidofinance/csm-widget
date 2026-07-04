import {
  TransactionModalTransitStage,
  TxStageFail,
  TxStagePending,
  TxStagePermit,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { getFailedStage } from 'shared/transaction-modal/hooks';
import { ErrorCode } from 'utils';

const getModalStages = (transitStage: TransactionModalTransitStage) => ({
  sign: () => transitStage(<TxStagePermit />),

  pending: () =>
    transitStage(
      <TxStagePending
        title="Connecting with backend"
        description="to check signature"
      />,
    ),

  failed: getFailedStage(transitStage, 'Sign in failed'),

  rejected: () =>
    transitStage(
      <TxStageFail title="Sign in failed" code={ErrorCode.DENIED_SIG} />,
    ),
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
