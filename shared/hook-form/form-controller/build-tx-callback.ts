import {
  type TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';

// Stage handlers with no input/data params — they close over those via the factory
export type FlowStages<TResult = undefined> = {
  sign(): void;
  pending(txHash?: string): void;
  success(result: TResult, txHash?: string): void;
  successMultisig(): void;
  failed(error: unknown, onRetry?: () => void): void;
  signPermit?(): void;
  signApproval?(amount: bigint, token: unknown): void;
  pendingApproval?(amount: bigint, token: unknown, txHash?: string): void;
};

// Pure function: stages + onRetry → TransactionCallback
export const buildTxCallback =
  <TResult = undefined>(
    stages: FlowStages<TResult>,
    onRetry: () => void,
  ): TransactionCallback<TResult> =>
  async ({ stage, payload }) => {
    switch (stage) {
      case TransactionCallbackStage.SIGN:
        stages.sign();
        break;
      case TransactionCallbackStage.RECEIPT:
        stages.pending(payload.hash);
        break;
      case TransactionCallbackStage.DONE:
        stages.success(payload.result, payload.hash);
        break;
      case TransactionCallbackStage.MULTISIG_DONE:
        stages.successMultisig();
        break;
      case TransactionCallbackStage.ERROR:
        stages.failed(payload.error, onRetry);
        break;
      case TransactionCallbackStage.PERMIT_SIGN:
        stages.signPermit?.();
        break;
      case TransactionCallbackStage.APPROVE_SIGN:
        stages.signApproval?.(payload.amount, payload.token);
        break;
      case TransactionCallbackStage.APPROVE_RECEIPT:
        stages.pendingApproval?.(payload.amount, payload.token, payload.hash);
        break;
      default:
    }
  };
