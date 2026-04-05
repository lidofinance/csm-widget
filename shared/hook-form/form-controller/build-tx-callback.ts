import {
  type TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import {
  type TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal';

// Shape that stage factories must satisfy for auto-callback building
export type TxCallbackStages<F, C, TResult> = {
  sign(input: F, data: C): void;
  pending(input: F, data: C, txHash?: string): void;
  success(input: F, data: C, result: TResult, txHash?: string): void;
  successMultisig(): void;
  failed(error: unknown, onRetry?: () => void): void;
  signPermit?(): void;
  signApproval?(amount: bigint, token: unknown): void;
  pendingApproval?(amount: bigint, token: unknown, txHash?: string): void;
};

// Pure function: stages + form data → TransactionCallback
export const buildTxCallback =
  <F, C, TResult = undefined>(
    stages: TxCallbackStages<F, C, TResult>,
    input: F,
    data: C,
    onRetry: () => void,
  ): TransactionCallback<TResult> =>
  async ({ stage, payload }) => {
    switch (stage) {
      case TransactionCallbackStage.SIGN:
        stages.sign(input, data);
        break;
      case TransactionCallbackStage.RECEIPT:
        stages.pending(input, data, payload.hash);
        break;
      case TransactionCallbackStage.DONE:
        stages.success(input, data, payload.result, payload.hash);
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

// Hook: combines useTransactionModalStage + buildTxCallback into one
export const useTxCallbackStages = <
  F,
  C,
  TResult = undefined,
  S extends TxCallbackStages<F, C, TResult> = TxCallbackStages<F, C, TResult>,
>(
  getStages: (transitStage: TransactionModalTransitStage) => S,
) => {
  const { txModalStages } = useTransactionModalStage(getStages);

  const buildCallback = useCallback(
    (input: F, data: C, onRetry: () => void) =>
      buildTxCallback(txModalStages, input, data, onRetry),
    [txModalStages],
  );

  return { txModalStages, buildCallback };
};
