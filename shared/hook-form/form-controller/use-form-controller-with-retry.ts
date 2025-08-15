import { useMemo } from 'react';
import { FormControllerContextValueType } from './form-controller-context';
import { useFormControllerRetry } from './use-form-controller-retry-delegate';
import { FieldValues } from 'react-hook-form';

export type FromRevalidate = () => Promise<void> | void;

export type FormSubmitOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry: () => void;
};

export type FormSubmitter<
  F extends FieldValues = any,
  C extends object = any,
> = (options: FormSubmitOptions) => (form: F, data: C) => Promise<boolean>;

export const useFormControllerWithRetry = <
  F extends FieldValues = any,
  C extends object = any,
>(
  submitter: FormSubmitter,
  revalidate?: FromRevalidate,
) => {
  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = submitter({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  const formControllerValue: FormControllerContextValueType<F, C> = useMemo(
    () => ({
      onSubmit,
      retryEvent,
    }),
    [onSubmit, retryEvent],
  );

  return formControllerValue;
};
