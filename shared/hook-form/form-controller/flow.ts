import { useCallback } from 'react';
import { type FieldValues } from 'react-hook-form';
import { handleTxError } from 'shared/transaction-modal';
import { type FormSubmitter } from './types';

// Intersection type for flow variants that can execute a transaction
export type Executable = {
  confirm?: () => Promise<boolean>;
  submit: () => Promise<unknown>;
  onError?: () => void;
};

// Resolver: pure function from (input, data) → Flow
export type FlowResolver<F extends FieldValues, C extends object, Flow> = (
  input: F,
  data: C,
) => Flow;

// Type guard: narrows flow to executable variant
export const isExecutable = <T extends { action: string }>(
  flow: T,
): flow is T & Executable =>
  'submit' in flow && typeof (flow as any).submit === 'function';

import { setFormRetry } from './form-retry';

// Generic submit: resolve → check → submit → confirm
export const useFlowSubmit = <F extends FieldValues, C extends object>(
  resolve: FlowResolver<F, C, { action: string }>,
): FormSubmitter<F, C> =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(
    async (input, data, { onConfirm, onRetry }) => {
      setFormRetry(onRetry);
      const flow = resolve(input, data);
      if (!isExecutable(flow)) return false;

      if (flow.confirm && !(await flow.confirm())) return false;

      try {
        await flow.submit();
        await onConfirm?.();
        return true;
      } catch (error) {
        flow.onError?.();
        return handleTxError(error);
      }
    },
    [resolve],
  );
