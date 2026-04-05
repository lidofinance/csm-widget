import { type TransactionCallback } from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { type FieldValues } from 'react-hook-form';
import { handleTxError } from 'shared/transaction-modal';
import { type FormSubmitter } from './types';

// Intersection type for flow variants that can execute a transaction
export type Executable<TResult = undefined> = {
  submit: (callback: TransactionCallback<TResult>) => Promise<unknown>;
};

// Resolver: pure function from (input, data) → Flow
export type FlowResolver<F extends FieldValues, C extends object, Flow> = (
  input: F,
  data: C,
) => Flow;

// Type guard: narrows flow to executable variant
export const isExecutable = <T extends { action: string }>(
  flow: T,
): flow is T & Executable<any> =>
  'submit' in flow && typeof (flow as any).submit === 'function';

// Generic submit: resolve → check → submit → confirm
// For forms WITHOUT side effects. Forms with cache/navigation/state use the pattern manually.
export const useFlowSubmit = <
  F extends FieldValues,
  C extends object,
  TResult = undefined,
>(
  resolve: FlowResolver<F, C, { action: string }>,
  buildCallback: (
    input: F,
    data: C,
    onRetry: () => void,
  ) => TransactionCallback<TResult>,
): FormSubmitter<F, C> =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(
    async (input, data, { onConfirm, onRetry }) => {
      const flow = resolve(input, data);
      if (!isExecutable(flow)) return false;

      try {
        await flow.submit(buildCallback(input, data, onRetry));
        await onConfirm?.();
        return true;
      } catch (error) {
        return handleTxError(error);
      }
    },
    [resolve, buildCallback],
  );
