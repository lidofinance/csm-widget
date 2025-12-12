import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import type { FieldValues } from 'react-hook-form';
import invariant from 'tiny-invariant';
import type { EventSubsciption } from 'utils';
import { useFormDataContext } from './form-data-context';
import { useFormControllerRetry } from './use-form-controller-retry-delegate';
import { FormSubmitOptions, FormSubmitter } from './types';

export type FormControllerContextValueType<
  F extends FieldValues = any,
  C extends object = any,
> = {
  isLocked?: boolean;
  formName?: string;
  onSubmit: FormSubmitter<F, C>;
  onReset?: (args: F) => void;
  retryEvent: EventSubsciption;
} & FormSubmitOptions;

export const FormControllerContext =
  createContext<FormControllerContextValueType | null>(null);
FormControllerContext.displayName = 'FormControllerContext';

export const useFormControllerContext = () => {
  const value = useContext(FormControllerContext);
  invariant(value, 'useFormControllerContext was used outside the provider');
  return value;
};

export const FormControllerProvider: FC<
  PropsWithChildren<{ submitter: FormSubmitter<any, any>; formName?: string }>
> = ({ children, submitter, formName }) => {
  const { revalidate } = useFormDataContext();

  const { retryEvent, retryFire } = useFormControllerRetry();
  const formController: FormControllerContextValueType = useMemo(
    () => ({
      formName,
      onSubmit: submitter,
      onConfirm: revalidate,
      onRetry: retryFire,
      retryEvent,
    }),
    [formName, retryEvent, retryFire, revalidate, submitter],
  );

  return (
    <FormControllerContext.Provider value={formController}>
      {children}
    </FormControllerContext.Provider>
  );
};
