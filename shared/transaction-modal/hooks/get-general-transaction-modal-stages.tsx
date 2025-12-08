import {
  TxStageFail,
  TxStagePermit,
  TxStageSuccessMultisig,
} from 'shared/transaction-modal/tx-stages-basic';
import { ErrorCode, extractErrorMessage, getErrorCode } from 'utils';
import { TxStageSignOperationAmount } from '../tx-stages-composed';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const getGeneralTransactionModalStages = (
  transitStage: TransactionModalTransitStage,
) => ({
  signPermit: () => transitStage(<TxStagePermit />),
  signApproval: (amount: bigint, token: TOKENS) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={token}
      />,
    ),
  pendingApproval: (amount: bigint, token: TOKENS, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),
  successMultisig: () =>
    transitStage(<TxStageSuccessMultisig />, {
      isClosableOnLedger: true,
    }),
  failed: (error: unknown, onRetry?: () => void) => {
    const code = getErrorCode(error);
    // Only show raw error message for unknown errors
    const errorMessage =
      code === ErrorCode.SOMETHING_WRONG
        ? extractErrorMessage(error)
        : undefined;
    return transitStage(
      <TxStageFail code={code} error={errorMessage} onRetry={onRetry} />,
      { isClosableOnLedger: true },
    );
  },
});
