import {
  type TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';

// Factory type: hook returns a function that builds a TransactionCallback from form input+data
export type TxModalStagesFactory<I, D, R = undefined> = (
  input: I,
  data: D,
) => TransactionCallback<R>;

// Stage handlers with no input/data params — they close over those via the factory
export type FlowStages<TResult = undefined> = {
  sign(): void;
  pending(txHash?: string): void;
  success(result: TResult, txHash?: string): void;
  successMultisig(): void;
  failed(error: unknown): void;
  signPermit?(): void;
  signApproval?(amount: bigint, token: unknown): void;
  pendingApproval?(amount: bigint, token: unknown, txHash?: string): void;
};

// Pure function: stages → TransactionCallback
export const buildTxCallback =
  <TResult = undefined>(
    stages: FlowStages<TResult>,
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
        stages.failed(payload.error);
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
